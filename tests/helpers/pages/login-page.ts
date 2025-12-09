import { Page, Locator, expect } from "@playwright/test";

/**
 * LoginPage - Page Objectパターンでログインページを抽象化
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly showPasswordButton: Locator;
  readonly errorAlert: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.showPasswordButton = page.getByTestId("password-toggle");
    // Next.js の route announcer を除外しつつ、アラートのみを対象
    this.errorAlert = page.getByRole("alert").filter({ hasText: /.*/ });
    this.heading = page.locator("h2");
  }

  /**
   * ログインページへ遷移
   */
  async goto() {
    await this.page.goto("/login");
    await this.waitForPageLoad();
  }

  /**
   * ページロード待機
   */
  async waitForPageLoad() {
    await expect(this.heading).toContainText("ログイン");
  }

  /**
   * ログイン実行
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * ログイン成功後のリダイレクト待機
   */
  async waitForSuccessfulLogin() {
    // ログイン成功後、ルートページ（蔵書一覧）にリダイレクト
    await this.page.waitForURL("/");
  }

  /**
   * エラーメッセージの表示を確認
   */
  async expectErrorMessage(message: string) {
    const alert = this.errorAlert.filter({ hasText: new RegExp(message) });
    await expect(alert).toBeVisible();
  }

  /**
   * パスワード表示/非表示トグル
   */
  async togglePasswordVisibility() {
    await this.showPasswordButton.click();
  }

  /**
   * パスワードが表示されているか確認
   */
  async isPasswordVisible(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute("type");
    return type === "text";
  }

  /**
   * 必須フィールドのバリデーションエラーを確認
   */
  async expectRequiredFieldError() {
    // HTML5のrequired属性によるバリデーション
    const emailRequired = await this.emailInput.getAttribute("required");
    const passwordRequired = await this.passwordInput.getAttribute("required");

    expect(emailRequired).not.toBeNull();
    expect(passwordRequired).not.toBeNull();
  }

  /**
   * ログインボタンがローディング状態か確認
   */
  async isLoginButtonLoading(): Promise<boolean> {
    const ariaLabel = await this.loginButton.getAttribute("aria-label");
    return ariaLabel?.includes("ログイン中") ?? false;
  }

  /**
   * フォームが送信可能か確認
   */
  async isFormSubmittable(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }
}
