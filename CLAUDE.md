# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## よく使うコマンド

### ビルドと実行
```bash
# ビルド（依存サービス起動込み）
cargo make build

# 開発サーバー起動（ホットリロード付き）
cargo make dev

# Docker内で実行
cargo make run-in-docker

# 通常実行
cargo make run

# フロントエンド開発サーバー起動
cd frontend && npm run dev
```

### テスト
```bash
# 全テスト実行（cargo-nextest使用）
cargo make test

# 個別のテスト実行
cargo nextest run --test <test_name>

# 特定のワークスペースのテスト
cargo nextest run -p <workspace_name>

# E2Eテスト実行（Playwright）
pnpm exec playwright test

# Playwrightのデバッグモード
pnpm exec playwright test --debug
```

### リント・フォーマット
```bash
# フォーマット
cargo make fmt

# Clippy
cargo make clippy

# CI用Clippy（警告をエラー扱い）
cargo make clippy-ci
```

### データベース
```bash
# マイグレーション実行
cargo make migrate

# SQLxコマンド実行
cargo make sqlx -- <args>

# 例: 新しいマイグレーション作成
cargo make sqlx -- migrate add <migration_name>

# psqlで直接接続
cargo make psql

# 初期データ投入
cargo make initial-setup
```

### Docker Compose
```bash
# PostgreSQL起動
cargo make compose-up-db

# Redis起動
cargo make compose-up-redis

# サービス停止
cargo make compose-down

# ボリューム含め全削除
cargo make compose-remove

# ログ確認
cargo make logs
```

### ユーティリティ
```bash
# パスワードハッシュ生成
cargo make create-hash <password>
```

## アーキテクチャの全体像

### ワークスペース構成とデータフロー

このプロジェクトは**クリーンアーキテクチャ**を採用し、依存関係が単方向になるよう設計されています：

```
[HTTPリクエスト]
      ↓
┌─────────────────────────────────────────┐
│  api                                    │  リクエスト/レスポンス変換
│  - handler: ビジネスロジック呼び出し    │  認証Extractor
│  - model: DTO定義                       │  OpenAPI仕様
│  - route: ルーティング                  │
└──────────────┬──────────────────────────┘
               ↓ 依存性注入
┌──────────────▼──────────────────────────┐
│  registry                               │  DIコンテナ
│  - AppRegistryImpl: 各リポジトリ管理    │  
│  - AppRegistryExt: 取得トレイト         │
└──────────────┬──────────────────────────┘
               ↓ リポジトリ取得
┌──────────────▼──────────────────────────┐
│  kernel                                 │  ビジネスルール
│  - model: ドメインモデル                │  リポジトリインターフェース定義
│  - repository: トレイト定義             │  ※実装を持たない
└──────────────┬──────────────────────────┘
               ↓ トレイト実装
┌──────────────▼──────────────────────────┐
│  adapter                                │  外部システム接続
│  - repository: リポジトリ実装           │  データベース・Redis
│  - database: DB接続とモデル             │  SQLクエリ実行
│  - redis: Redis接続とキャッシュ         │
└─────────────────────────────────────────┘
               ↓
      [PostgreSQL / Redis]
```

**重要な依存関係ルール:**
- `kernel`は他のワークスペースに依存しない（`shared`のみ依存）
- `adapter`は`kernel`のトレイトを実装する（依存性逆転の原則）
- `api`は`kernel`のドメインモデルを使い、`registry`経由でリポジトリを取得
- `registry`がすべてを組み立てる

### 認証フロー

1. ユーザーが`POST /auth/login`でログイン
2. `adapter`がパスワードハッシュを検証（bcrypt）
3. トークン生成し、Redisに保存（TTL付き）
4. `AuthorizedUser` Extractor がトークンを検証（Redisから取得）
5. リクエストごとに`Authorization: Bearer <token>`で認証

### 主要なディレクトリとその役割

- `adapter/migrations/`: SQLxマイグレーションファイル
- `api/src/handler/`: 各エンドポイントのハンドラ実装
- `api/src/route/`: ルーティング定義
- `kernel/src/model/`: ドメインモデル（Book, User, Checkout等）
- `kernel/src/repository/`: リポジトリトレイト定義
- `adapter/src/repository/`: リポジトリ実装（SQLx使用）
- `registry/src/`: DIコンテナ実装
- `shared/src/`: 共通エラー型、設定管理

## 実装時の重要なポイント

### 新しいエンドポイント追加

1. `kernel/src/model/`にドメインモデルを定義
2. `kernel/src/repository/`にトレイトメソッドを追加
3. `adapter/src/repository/`にSQLクエリを実装
4. `api/src/model/`にリクエスト/レスポンスDTOを定義
5. `api/src/handler/`にハンドラを実装
6. `api/src/route/`にルーティングを追加
7. OpenAPI仕様を更新（`#[utoipa::path]`マクロ）

### リポジトリパターン

すべてのデータアクセスは`kernel`のトレイトを経由します：

```rust
// kernel/src/repository/book.rs
#[async_trait]
pub trait BookRepository {
    async fn create(&self, book: CreateBook) -> AppResult<Book>;
}

// adapter/src/repository/book.rs
impl BookRepository for BookRepositoryImpl {
    async fn create(&self, book: CreateBook) -> AppResult<Book> {
        // SQLx実装
    }
}
```

### 認証が必要なエンドポイント

ハンドラの引数に`AuthorizedUser`を追加するだけで認証が有効化されます：

```rust
pub async fn handler(
    AuthorizedUser(user): AuthorizedUser,  // 認証必須
    State(registry): State<Arc<AppRegistryImpl>>,
) -> AppResult<Json<Response>> {
    // user.user_id, user.role でアクセス
}
```

### エラーハンドリング

- `shared::error::AppError`を使用
- `anyhow::Context`でコンテキスト情報を追加
- 戻り値は`AppResult<T>`（`Result<T, AppError>`のエイリアス）

### テスト作成

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use rstest::rstest;
    use mockall::predicate::*;

    #[rstest]
    #[tokio::test]
    async fn test_example() {
        // mockallでリポジトリをモック化
        let mut mock_repo = MockBookRepository::new();
        mock_repo.expect_create()
            .returning(|_| Ok(book));
        
        // テスト実行
    }
}
```

### マイグレーション作成

```bash
# 新しいマイグレーション作成
cargo make sqlx -- migrate add <name>

# adapter/migrations/に作成される
# ファイル名: <timestamp>_<name>.sql
```

## フロントエンド連携

- Next.js 14使用
- `/frontend`ディレクトリで独立して開発
- バックエンドAPIは`http://localhost:8080/api/v1/`
- SWRでデータフェッチング
- Chakra UIでスタイリング

## 環境変数

必須の環境変数（Makefile.tomlでデフォルト値設定済み）：

```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=app
DATABASE_USERNAME=app
DATABASE_PASSWORD=passwd
REDIS_HOST=localhost
REDIS_PORT=6379
AUTH_TOKEN_TTL=86400
```

Docker内での実行時は`postgres`, `redis`がホスト名になります。

## 型の世代

- Edition 2024を使用（rust-toolchain.toml）
- SQLxの型チェックはコンパイル時に実行
- `#[derive(Debug, Clone, ...)]`を積極的に使用
- utoipaマクロでOpenAPI仕様を自動生成

## OpenAPI仕様

- `/docs`でRedoc UIにアクセス
- `api/src/openapi.rs`で定義
- ハンドラに`#[utoipa::path(...)]`を付与
- モデルに`#[derive(ToSchema)]`を付与
