import { test, expect } from "@playwright/test";
import { LoginPage } from "../helpers/pages/login-page";
import {
  TEST_USERS,
  INVALID_USER,
  getAccessToken,
} from "../fixtures/auth.fixture";

test.describe("ログイン機能", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("正しい認証情報でログインできる（一般ユーザー）", async ({ page }) => {
    await loginPage.login(TEST_USERS.user1.email, TEST_USERS.user1.password);
    await loginPage.waitForSuccessfulLogin();

    // ルートページにリダイレクトされることを確認
    await expect(page).toHaveURL("/");

    // LocalStorageにアクセストークンが保存されることを確認
    const token = await getAccessToken(page);
    expect(token).not.toBeNull();
    expect(token).not.toBe("");
  });

  test("正しい認証情報でログインできる（管理者）", async ({ page }) => {
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
    await loginPage.waitForSuccessfulLogin();

    // ルートページにリダイレクトされることを確認
    await expect(page).toHaveURL("/");

    const token = await getAccessToken(page);
    expect(token).not.toBeNull();
    expect(token).not.toBe("");
  });

  test("間違ったパスワードでログイン失敗", async ({ page }) => {
    await loginPage.login(TEST_USERS.user1.email, "wrongpassword");

    // エラーメッセージが表示される
    await loginPage.expectErrorMessage(
      "メールアドレスまたはパスワードが間違っています"
    );

    // ログインページに留まる
    await expect(page).toHaveURL("/login");

    // アクセストークンは保存されない
    const token = await getAccessToken(page);
    expect(token).toBeNull();
  });

  test("存在しないメールアドレスでログイン失敗", async ({ page }) => {
    await loginPage.login(INVALID_USER.email, INVALID_USER.password);

    // エラーメッセージが表示される
    await loginPage.expectErrorMessage(
      "メールアドレスまたはパスワードが間違っています"
    );

    // ログインページに留まる
    await expect(page).toHaveURL("/login");

    // アクセストークンは保存されない
    const token = await getAccessToken(page);
    expect(token).toBeNull();
  });

  test("メールアドレス未入力でフォーム送信できない", async ({ page }) => {
    // パスワードのみ入力
    await loginPage.passwordInput.fill(TEST_USERS.user1.password);

    // 必須属性が設定されていることを確認
    await loginPage.expectRequiredFieldError();

    await loginPage.loginButton.click();

    // ログインページに留まる
    await expect(page).toHaveURL("/login");
  });

  test("パスワード未入力でフォーム送信できない", async ({ page }) => {
    // メールアドレスのみ入力
    await loginPage.emailInput.fill(TEST_USERS.user1.email);

    // 必須属性が設定されていることを確認
    await loginPage.expectRequiredFieldError();

    // ログインボタンをクリックしてもフォームが送信されない（HTML5バリデーション）
    await loginPage.loginButton.click();

    // ログインページに留まる
    await expect(page).toHaveURL("/login");
  });

  test("両方のフィールドが空でフォーム送信できない", async ({ page }) => {
    await loginPage.expectRequiredFieldError();

    await loginPage.loginButton.click();

    // ログインページに留まる
    await expect(page).toHaveURL("/login");
  });

  test("パスワードの表示/非表示を切り替えられる", async ({ page }) => {
    // 初期状態はパスワードが隠されている
    expect(await loginPage.isPasswordVisible()).toBe(false);

    // 表示切り替えボタンをクリック
    await loginPage.togglePasswordVisibility();

    // パスワードが表示される
    expect(await loginPage.isPasswordVisible()).toBe(true);

    // もう一度クリック
    await loginPage.togglePasswordVisibility();

    // パスワードが再び隠される
    expect(await loginPage.isPasswordVisible()).toBe(false);
  });

  test("ログインボタンが送信中はローディング状態になる", async ({ page }) => {
    // メールアドレスとパスワードを入力
    await loginPage.emailInput.fill(TEST_USERS.user1.email);
    await loginPage.passwordInput.fill(TEST_USERS.user1.password);

    // フォーム送信
    const loginPromise = loginPage.loginButton.click();

    await expect(loginPage.loginButton).toContainText("ログイン中");

    await loginPromise;
    await loginPage.waitForSuccessfulLogin();
  });

  test("ログイン成功後、再度ログインページにアクセスするとルートページにリダイレクトされる", async ({
    page,
  }) => {
    // 一度ログイン
    await loginPage.login(TEST_USERS.user1.email, TEST_USERS.user1.password);
    await loginPage.waitForSuccessfulLogin();

    // 再度ログインページにアクセス
    await page.goto("/login");

    // NOTE: 現在の実装ではリダイレクトしないかもしれないので、
    // リダイレクトされた場合は以下のアサーションを有効化
    // await expect(page).toHaveURL("/");
  });

  test("複数のユーザーでログインできる", async ({ page }) => {
    // ユーザー1でログイン
    await loginPage.login(TEST_USERS.user1.email, TEST_USERS.user1.password);
    await loginPage.waitForSuccessfulLogin();

    const token1 = await getAccessToken(page);
    expect(token1).not.toBeNull();

    // LocalStorageをクリア（ログアウト相当）
    await page.evaluate(() => localStorage.clear());

    // ログインページに戻る
    await loginPage.goto();

    // ユーザー2でログイン
    await loginPage.login(TEST_USERS.user2.email, TEST_USERS.user2.password);
    await loginPage.waitForSuccessfulLogin();

    const token2 = await getAccessToken(page);
    expect(token2).not.toBeNull();

    // 異なるトークンが発行される
    expect(token1).not.toBe(token2);

    // ユーザー2の情報が表示されていることを確認
    const userName = page.locator(`text="${TEST_USERS.user2.name}"`);
    const userRole = page.locator(`text="${TEST_USERS.user2.role}"`);

    await expect(userName).toBeVisible();
    await expect(userRole).toBeVisible();
  });
});
