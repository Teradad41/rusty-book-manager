import type { Page } from "@playwright/test";
import { LoginPage } from "../helpers/pages/login-page";

/**
 * テスト用ユーザー情報
 * data/initial_setup.sql に定義されているユーザーデータ
 */
export const TEST_USERS = {
  admin: {
    email: "sitiang120@gmail.com",
    password: "Pa55w0rd", // ハッシュ前のパスワード
    name: "Kyo Terada",
    role: "Admin",
  },
  user1: {
    email: "yamada@example.com",
    password: "password",
    name: "山田太郎",
    role: "User",
  },
  user2: {
    email: "sato@example.com",
    password: "password",
    name: "佐藤花子",
    role: "User",
  },
  user3: {
    email: "suzuki@example.com",
    password: "password",
    name: "鈴木一郎",
    role: "User",
  },
  user4: {
    email: "tanaka@example.com",
    password: "password",
    name: "田中美咲",
    role: "User",
  },
  user5: {
    email: "takahashi@example.com",
    password: "password",
    name: "高橋健太",
    role: "User",
  },
} as const;

/**
 * 無効なユーザー情報（テスト用）
 */
export const INVALID_USER = {
  email: "invalid@example.com",
  password: "wrongpassword",
};

/**
 * ログインヘルパー - 一般ユーザーとしてログイン
 */
export async function loginAsUser(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_USERS.user1.email, TEST_USERS.user1.password);
  await loginPage.waitForSuccessfulLogin();
}

/**
 * ログインヘルパー - 管理者としてログイン
 */
export async function loginAsAdmin(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
  await loginPage.waitForSuccessfulLogin();
}

/**
 * ログインヘルパー - 特定のユーザーでログイン
 */
export async function loginAs(page: Page, userKey: keyof typeof TEST_USERS) {
  const user = TEST_USERS[userKey];
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await loginPage.waitForSuccessfulLogin();
}

/**
 * ログアウトヘルパー
 */
export async function logout(page: Page) {
  // ヘッダーのログアウトボタンをクリック
  const logoutButton = page.locator("button", { hasText: "ログアウト" });
  await logoutButton.click();

  // ログインページにリダイレクトされるまで待機
  await page.waitForURL("/login");
}

// アプリ実装に合わせたアクセストークンの保存キー
const ACCESS_TOKEN_KEY = "access-token";

/**
 * LocalStorageからアクセストークンを取得
 */
export async function getAccessToken(page: Page): Promise<string | null> {
  return await page.evaluate((key) => {
    return localStorage.getItem(key);
  }, ACCESS_TOKEN_KEY);
}

/**
 * LocalStorageにアクセストークンを設定（APIを直接叩いてテスト前にセットアップする場合）
 */
export async function setAccessToken(page: Page, token: string) {
  await page.evaluate(
    (payload) => {
      localStorage.setItem(payload.key, payload.token);
    },
    { key: ACCESS_TOKEN_KEY, token }
  );
}

/**
 * LocalStorageからアクセストークンを削除
 */
export async function clearAccessToken(page: Page) {
  await page.evaluate((key) => {
    localStorage.removeItem(key);
  }, ACCESS_TOKEN_KEY);
}

/**
 * 認証状態をチェック
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const token = await getAccessToken(page);
  return token !== null && token !== "";
}

/**
 * ログイン状態でページに遷移（事前にログインしてから指定URLへ遷移）
 */
export async function gotoAsUser(page: Page, url: string) {
  await loginAsUser(page);
  await page.goto(url);
}

/**
 * 管理者ログイン状態でページに遷移
 */
export async function gotoAsAdmin(page: Page, url: string) {
  await loginAsAdmin(page);
  await page.goto(url);
}
