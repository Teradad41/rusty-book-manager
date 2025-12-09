# E2Eテスト

このディレクトリにはPlaywrightを使用したE2Eテストが含まれています。

## ディレクトリ構成

```
tests/
├── auth/                           # 認証関連のテスト
│   ├── login.spec.ts              # ログイン機能テスト
│   ├── logout.spec.ts             # ログアウト機能テスト
│   └── session-persistence.spec.ts # セッション永続化テスト
├── fixtures/                       # テストヘルパー・フィクスチャ
│   └── auth.fixture.ts            # 認証用ヘルパー関数とテストデータ
└── helpers/                        # Page Objectパターン
    └── pages/
        └── login-page.ts          # LoginページのPage Object

```

## テスト実行前の準備

### 1. データベースとRedisの起動

```bash
cargo make compose-up-db
cargo make compose-up-redis
```

### 2. データベースマイグレーション

```bash
cargo make migrate
```

### 3. 初期データ投入

```bash
cargo make initial-setup
```

### 4. バックエンドサーバー起動

別のターミナルで:
```bash
cargo make run
# または開発モード
cargo make dev
```

### 5. フロントエンド開発サーバー起動

別のターミナルで:
```bash
cd frontend
npm run dev
```

## テスト実行

### すべてのテストを実行

```bash
pnpm exec playwright test
```

### 特定のテストファイルを実行

```bash
# ログインテストのみ
pnpm exec playwright test tests/auth/login.spec.ts

# 認証関連テストすべて
pnpm exec playwright test tests/auth/
```

### UIモードで実行（インタラクティブ）

```bash
pnpm exec playwright test --ui
```

### デバッグモード

```bash
pnpm exec playwright test --debug
```

### ヘッドフルモード（ブラウザを表示）

```bash
pnpm exec playwright test --headed
```

### 特定のブラウザで実行

```bash
# Chromiumのみ
pnpm exec playwright test --project=chromium

# Firefoxのみ（現在コメントアウト中）
pnpm exec playwright test --project=firefox
```

## テストレポート

テスト実行後、レポートを確認:

```bash
pnpm exec playwright show-report
```

## CI/CDでの実行

GitHub Actionsなどで実行する場合:

```bash
# CI環境変数を設定して実行
CI=true pnpm exec playwright test
```

CI環境では:
- リトライが2回有効
- 並列実行は1ワーカーに制限
- すべてのブラウザでテスト（設定変更が必要）

## トラブルシューティング

### テストがタイムアウトする

- バックエンド・フロントエンドが起動しているか確認
- `http://localhost:3000` と `http://localhost:8080` にアクセスできるか確認

### ログインテストが失敗する

- 初期データが投入されているか確認: `cargo make initial-setup`
- テストユーザーのパスワードは `password`

### セッション永続化テストが失敗する

- LocalStorageにアクセストークンが保存されているか確認
- Redisが起動しているか確認

## テストユーザー

`tests/fixtures/auth.fixture.ts` に定義されているテストユーザー:

- **管理者**: `sitiang120@gmail.com` / `password`
- **一般ユーザー1**: `yamada@example.com` / `password`
- **一般ユーザー2**: `sato@example.com` / `password`
- **一般ユーザー3**: `suzuki@example.com` / `password`
- **一般ユーザー4**: `tanaka@example.com` / `password`
- **一般ユーザー5**: `takahashi@example.com` / `password`

## 今後のテスト追加予定

- [ ] 蔵書CRUD操作テスト
- [ ] 貸出・返却フローテスト
- [ ] ユーザー管理テスト（管理者権限）
- [ ] パスワード変更テスト
- [ ] エンドツーエンドシナリオテスト
