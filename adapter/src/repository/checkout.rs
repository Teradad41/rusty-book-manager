use async_trait::async_trait;
use derive_new::new;
use kernel::{
    model::{
        checkout::{
            Checkout,
            event::{CreateCheckout, UpdateReturned},
        },
        id::{BookId, CheckoutId, UserId},
    },
    repository::checkout::CheckoutRepository,
};
use shared::error::{AppError, AppResult};

use crate::database::{
    ConnectionPool,
    model::checkout::{CheckoutRow, CheckoutStateRow, ReturnedCheckoutRow},
};

#[derive(new)]
pub struct CheckoutRepositoryImpl {
    db: ConnectionPool,
}

#[async_trait]
impl CheckoutRepository for CheckoutRepositoryImpl {
    // 貸出操作
    async fn create(&self, event: CreateCheckout) -> AppResult<()> {
        let mut tx = self.db.begin().await?;

        //トランザクション分離レベルを SERIALIZABLEに設定
        self.set_transaction_serializable(&mut tx).await?;

        // チェックアウトの作成処理
        {
            let res = sqlx::query_as!(
                CheckoutStateRow,
                r#"
                    SELECT
                        b.book_id,
                        c.checkout_id AS "checkout_id?: CheckoutId",
                        NULL AS "user_id?: UserId"
                    FROM books AS b
                    LEFT OUTER JOIN checkouts AS c USING(book_id)
                    WHERE book_id = $1
                "#,
                event.book_id as _
            )
            .fetch_optional(&mut *tx)
            .await
            .map_err(AppError::SpecificOperationError)?;

            match res {
                // 指定した書籍がない場合
                None => {
                    return Err(AppError::EntityNotFound(format!(
                        "書籍({})が見つかりませんでした。",
                        event.book_id
                    )));
                }
                Some(CheckoutStateRow {
                    checkout_id: Some(_),
                    ..
                }) => {
                    return Err(AppError::UnprocessableEntity(format!(
                        "書籍({})はすでにチェックアウトされています。",
                        event.book_id
                    )));
                }
                _ => {}
            }
        }

        let checkout_id = CheckoutId::new();
        let res = sqlx::query!(
            r#"
                INSERT INTO checkouts
                (checkout_id, book_id, user_id, checked_out_at)
                VALUES ($1, $2, $3, $4)
                ;
            "#,
            checkout_id as _,
            event.book_id as _,
            event.checked_out_by as _,
            event.checked_out_at,
        )
        .execute(&mut *tx)
        .await
        .map_err(AppError::SpecificOperationError)?;

        if res.rows_affected() == 0 {
            return Err(AppError::UnprocessableEntity(
                "No checkout record has been created".into(),
            ));
        }

        tx.commit().await.map_err(AppError::TransactionError)?;
        Ok(())
    }

    // 返却操作
    async fn update_returned(&self, event: UpdateReturned) -> AppResult<()> {
        let mut tx = self.db.begin().await?;

        // トランザクション分離レベルを SERIALIZABLE に設定する
        self.set_transaction_serializable(&mut tx).await?;

        // 返却操作時は事前のチェックとして、以下を調べる。
        // - 指定の蔵書 ID をもつ蔵書が存在するか
        // - 存在した場合、
        // - この蔵書は貸出中であり
        // - かつ、借りたユーザーが指定のユーザーと同じか
        //
        // 上記の両方が Yes だった場合、このブロック以降の処理に進む
        {
            let res = sqlx::query_as!(
                CheckoutStateRow,
                r#"
                    SELECT
                    b.book_id,
                    c.checkout_id AS "checkout_id?: CheckoutId",
                    c.user_id AS "user_id?: UserId"
                    FROM books AS b
                    LEFT OUTER JOIN checkouts AS c USING(book_id)
                    WHERE book_id = $1;
                "#,
                event.book_id as _,
            )
            .fetch_optional(&mut *tx)
            .await
            .map_err(AppError::SpecificOperationError)?;

            match res {
                None => {
                    return Err(AppError::EntityNotFound(format!(
                        " 書籍（{}）が見つかりませんでした。",
                        event.book_id
                    )));
                }
                // 指定した書籍が貸出中であり、貸出 ID または借りたユーザーが異なる場合
                Some(CheckoutStateRow {
                    checkout_id: Some(c),
                    user_id: Some(u),
                    ..
                }) if (c, u) != (event.checkout_id, event.returned_by) => {
                    return Err(AppError::UnprocessableEntity(format!(
                        " 指定の貸出（ID（{}）, ユーザー（{}）, 書籍（{}））は返却できません。",
                        event.checkout_id, event.returned_by, event.book_id
                    )));
                }
                _ => {}
            }
        }

        // checkouts テーブルにある該当貸出 ID のレコードを、
        // returned_at を追加して returned_checkouts テーブルに INSERT する
        let res = sqlx::query!(
            r#"
                INSERT INTO returned_checkouts
                (checkout_id, book_id, user_id, checked_out_at, returned_at)
                SELECT checkout_id, book_id, user_id, checked_out_at, $2
                FROM checkouts
                WHERE checkout_id = $1
                ;
            "#,
            event.checkout_id as _,
            event.returned_at,
        )
        .execute(&mut *tx)
        .await
        .map_err(AppError::SpecificOperationError)?;

        if res.rows_affected() < 1 {
            return Err(AppError::NoRowsAffectedError(
                "No returning record has been updated".into(),
            ));
        }

        // 処理が成功したら checkouts テーブルから該当貸出 ID のレコードを削除する
        let res = sqlx::query!(
            r#"
                    DELETE FROM checkouts WHERE checkout_id = $1;
                "#,
            event.checkout_id as _,
        )
        .execute(&mut *tx)
        .await
        .map_err(AppError::SpecificOperationError)?;

        if res.rows_affected() < 1 {
            return Err(AppError::NoRowsAffectedError(
                "No checkout record has been deleted".into(),
            ));
        }

        tx.commit().await.map_err(AppError::TransactionError)?;
        Ok(())
    }

    // 未返却一覧
    async fn find_unreturned_all(&self) -> AppResult<Vec<Checkout>> {
        sqlx::query_as!(
            CheckoutRow,
            r#"
                SELECT
                c.checkout_id AS "checkout_id!: CheckoutId",
                c.book_id AS "book_id!: BookId",
                c.user_id AS "user_id!: UserId",
                u.name AS user_name,
                c.checked_out_at,
                b.title,
                b.author,
                b.isbn
                FROM checkouts AS c
                INNER JOIN books AS b ON b.book_id = c.book_id
                INNER JOIN users AS u ON u.user_id = c.user_id
                ORDER BY c.checked_out_at ASC
                ;
            "#,
        )
        .fetch_all(self.db.inner_ref())
        .await
        .map(|rows| rows.into_iter().map(Checkout::from).collect())
        .map_err(AppError::SpecificOperationError)
    }

    // ユーザーID に紐づく未返却の貸出情報を取得
    async fn find_unreturned_by_user_id(&self, user_id: UserId) -> AppResult<Vec<Checkout>> {
        sqlx::query_as!(
            CheckoutRow,
            r#"
                SELECT
                c.checkout_id AS "checkout_id!: CheckoutId",
                c.book_id AS "book_id!: BookId",
                c.user_id AS "user_id!: UserId",
                u.name AS user_name,
                c.checked_out_at,
                b.title,
                b.author,
                b.isbn
                FROM checkouts AS c
                INNER JOIN books AS b ON b.book_id = c.book_id
                INNER JOIN users AS u ON u.user_id = c.user_id
                WHERE c.user_id = $1
                ORDER BY c.checked_out_at ASC
                ;
            "#,
            user_id as _
        )
        .fetch_all(self.db.inner_ref())
        .await
        .map(|rows| rows.into_iter().map(Checkout::from).collect())
        .map_err(AppError::SpecificOperationError)
    }

    // 蔵書の貸出履歴
    async fn find_history_by_book_id(&self, book_id: BookId) -> AppResult<Vec<Checkout>> {
        // 未返却の貸出情報を取得
        let checkout: Option<Checkout> = self.find_unreturned_by_book_id(book_id).await?;

        // 返却済みの貸出情報を取得
        let mut checkout_histories: Vec<Checkout> = sqlx::query_as!(
            ReturnedCheckoutRow,
            r#"
                SELECT
                    rc.checkout_id AS "checkout_id!: CheckoutId",
                    rc.book_id AS "book_id!: BookId",
                    rc.user_id AS "user_id!: UserId",
                    u.name AS user_name,
                    rc.checked_out_at,
                    rc.returned_at,
                    b.title,
                    b.author,
                    b.isbn
                FROM returned_checkouts AS rc
                INNER JOIN books AS b ON b.book_id = rc.book_id
                INNER JOIN users AS u ON u.user_id = rc.user_id
                WHERE rc.book_id = $1
                ORDER BY rc.checked_out_at DESC
            "#,
            book_id as _
        )
        .fetch_all(self.db.inner_ref())
        .await
        .map_err(AppError::SpecificOperationError)?
        .into_iter()
        .map(Checkout::from)
        .collect();

        // 貸出中である場合は返却済みの履歴の先頭に追加する
        if let Some(co) = checkout {
            checkout_histories.insert(0, co);
        }

        Ok(checkout_histories)
    }
}

impl CheckoutRepositoryImpl {
    async fn set_transaction_serializable(
        &self,
        tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
    ) -> AppResult<()> {
        sqlx::query!("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE")
            .execute(&mut **tx)
            .await
            .map_err(AppError::SpecificOperationError)?;
        Ok(())
    }

    // find_history_by_book_id で未返却の貸出情報を取得するためのメソッド
    async fn find_unreturned_by_book_id(&self, book_id: BookId) -> AppResult<Option<Checkout>> {
        let res = sqlx::query_as!(
            CheckoutRow,
            r#"
                SELECT
                    c.checkout_id AS "checkout_id!: CheckoutId",
                    c.book_id AS "book_id!: BookId",
                    c.user_id AS "user_id!: UserId",
                    u.name AS user_name,
                    c.checked_out_at,
                    b.title,
                    b.author,
                    b.isbn
                FROM checkouts AS c
                INNER JOIN books AS b ON b.book_id = c.book_id
                INNER JOIN users AS u ON u.user_id = c.user_id
                WHERE c.book_id = $1
            "#,
            book_id as _,
        )
        .fetch_optional(self.db.inner_ref())
        .await
        .map_err(AppError::SpecificOperationError)?
        .map(Checkout::from);

        Ok(res)
    }
}
