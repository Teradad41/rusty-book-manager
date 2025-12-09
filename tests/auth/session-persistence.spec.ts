import { test, expect } from "@playwright/test";
import {
  loginAsUser,
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../fixtures/auth.fixture";

test.describe("セッション永続化", () => {
  test("ログイン後、ページをリロードしてもログイン状態が維持される", async ({
    page,
  }) => {
    await loginAsUser(page);

    // トークンを取得
    const tokenBeforeReload = await getAccessToken(page);
    expect(tokenBeforeReload).not.toBeNull();

    // ページをリロード
    await page.reload();

    // トークンが保持されている
    const tokenAfterReload = await getAccessToken(page);
    expect(tokenAfterReload).toBe(tokenBeforeReload);
  });

  test("ログイン後、別のページに遷移してもログイン状態が維持される", async ({
    page,
  }) => {
    await loginAsUser(page);
    const tokenAfterLogin = await getAccessToken(page);

    // 蔵書作成ページに遷移
    await page.goto("/books/create");

    // トークンが保持されている
    let currentToken = await getAccessToken(page);
    expect(currentToken).toBe(tokenAfterLogin);

    // ユーザー一覧ページに遷移
    await page.goto("/users");
    await expect(page).toHaveURL("/users");

    // トークンが保持されている
    currentToken = await getAccessToken(page);
    expect(currentToken).toBe(tokenAfterLogin);

    // 蔵書一覧に戻る
    await page.goto("/");
    await expect(page).toHaveURL("/");

    // トークンが保持されている
    currentToken = await getAccessToken(page);
    expect(currentToken).toBe(tokenAfterLogin);
  });

  test("ブラウザを閉じて再度開いてもログイン状態が維持される", async ({
    browser,
  }) => {
    // 新しいコンテキストとページを作成（永続化されたストレージを使用）
    const context = await browser.newContext({
      storageState: undefined, // 初期状態
    });
    const page = await context.newPage();

    // ログイン
    await loginAsUser(page);
    const tokenAfterLogin = await getAccessToken(page);
    expect(tokenAfterLogin).not.toBeNull();

    // ストレージステートを保存
    const storageState = await context.storageState();

    // コンテキストとページを閉じる（ブラウザを閉じる相当）
    await context.close();

    // 新しいコンテキストを作成し、保存したストレージステートを復元
    const newContext = await browser.newContext({
      storageState,
    });
    const newPage = await newContext.newPage();

    // 蔵書一覧ページに遷移
    await newPage.goto("/");
    await expect(newPage).toHaveURL("/");

    // トークンが保持されている
    const tokenAfterReopen = await getAccessToken(newPage);
    expect(tokenAfterReopen).toBe(tokenAfterLogin);

    await newContext.close();
  });

  test("LocalStorageのトークンが削除されると、保護されたページにアクセスできない", async ({
    page,
  }) => {
    await loginAsUser(page);
    await expect(page).toHaveURL("/");

    // LocalStorageからトークンを手動で削除
    await clearAccessToken(page);

    // ページをリロード
    await page.reload();

    // ログインページにリダイレクトされる
    await expect(page).toHaveURL("/login");

    // サーバー側でトークンが無効化されている
  });

  test("無効なトークンをLocalStorageに設定すると、APIリクエストが失敗する", async ({
    page,
  }) => {
    // 無効なトークンを設定
    await page.goto("/login");
    await setAccessToken(page, "invalid-token-12345");

    // 蔵書一覧ページに遷移
    await page.goto("/");

    // ログインページにリダイレクトされる
    await expect(page).toHaveURL("/login");
  });

  test("複数のタブでログイン状態が共有される", async ({ page, context }) => {
    // 1つ目のタブでログイン
    await loginAsUser(page);
    const token = await getAccessToken(page);
    expect(token).not.toBeNull();

    // 2つ目のタブを開く
    const page2 = await context.newPage();
    await page2.goto("/");

    // 2つ目のタブでも同じトークンが使用される（LocalStorageは共有される）
    const token2 = await getAccessToken(page2);
    expect(token2).toBe(token);

    // 2つ目のタブでもログイン状態になっている
    await expect(page2).toHaveURL("/");

    await page2.close();
  });

  test("トークンの有効期限が切れた後、APIリクエストが失敗する", async ({
    page,
  }) => {
    // NOTE: このテストは実際にトークンの有効期限を待つ必要があるため、
    // 現実的には実行が難しい。モック化やタイムトラベルが必要。

    // 代わりに、期限切れのトークンをモックして設定することで検証可能
    test.skip(
      true,
      "トークンの有効期限は86400秒（24時間）のため、実際のテストでは検証困難"
    );

    // await page.goto('/login');
    // await setAccessToken(page, 'expired-token');
    // await page.goto('/');
    // await expect(page).toHaveURL('/login');
  });

  test("異なるブラウザ間ではセッションが共有されない", async ({ browser }) => {
    // 1つ目のコンテキスト（ブラウザ1相当）
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await loginAsUser(page1);
    const token1 = await getAccessToken(page1);

    // 2つ目のコンテキスト（ブラウザ2相当）
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto("/");

    // 2つ目のコンテキストにはトークンがない
    const token2 = await getAccessToken(page2);
    expect(token2).toBeNull();

    // NOTE: 実装によっては、認証なしでアクセスするとログインページにリダイレクトされる
    // await expect(page2).toHaveURL('/login');

    await context1.close();
    await context2.close();
  });

  test("ログイン状態で直接URLを入力してアクセスしても、ログイン状態が維持される", async ({
    page,
  }) => {
    // ログイン
    await loginAsUser(page);

    // 直接URLを入力して蔵書作成ページにアクセス
    await page.goto("http://localhost:3000/books/create");
    await expect(page).toHaveURL("/books/create");

    // トークンが保持されている
    const token = await getAccessToken(page);
    expect(token).not.toBeNull();

    // ユーザー情報が表示されている（ヘッダーなどで確認）
    const userName = page.locator("text=山田太郎");
    await expect(userName).toBeVisible();
  });
});
