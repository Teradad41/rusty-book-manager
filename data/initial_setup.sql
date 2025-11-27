INSERT INTO
    roles (name)
VALUES
    ('Admin'),
    ('User')
ON CONFLICT DO NOTHING;

/* ユーザー登録（重複時はスキップ） */
-- 管理者ユーザー
INSERT INTO
    users (name, email, password_hash, role_id)
SELECT
    'Kyo Terada',
    'sitiang120@gmail.com',
    '$2b$12$eX6ZxocXTKTV5ys9sxhuT.Eff7cSrqsWcekMR.BrtXTTgs.pXyLdW',
    role_id
FROM
    roles
WHERE
    name LIKE 'Admin'
AND NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'sitiang120@gmail.com'
);

-- 一般ユーザー（User権限）
-- パスワードは全て "password123" をハッシュ化したもの
INSERT INTO
    users (name, email, password_hash, role_id)
SELECT
    u.name,
    u.email,
    '$2b$12$luRkd0.boAmPusBdZlOyNuiIr3uXr2Cwgd4lqIzpJ2a.Wyqo/IKCi',
    role_id
FROM
    (VALUES
        ('山田太郎', 'yamada@example.com'),
        ('佐藤花子', 'sato@example.com'),
        ('鈴木一郎', 'suzuki@example.com'),
        ('田中美咲', 'tanaka@example.com'),
        ('高橋健太', 'takahashi@example.com')
    ) AS u(name, email)
CROSS JOIN
    roles
WHERE
    roles.name LIKE 'User'
AND NOT EXISTS (
    SELECT 1 FROM users WHERE users.email = u.email
);

/* 書籍の初期データ投入 */
-- 各ユーザーに書籍を割り当て
WITH user_list AS (
    SELECT user_id, email, ROW_NUMBER() OVER (ORDER BY email) as user_num
    FROM users
)
INSERT INTO books (title, author, isbn, description, user_id)
SELECT
    b.title,
    b.author,
    b.isbn,
    b.description,
    u.user_id
FROM
    (VALUES
        /* 山田太郎の書籍（1-4） */
        ('罪と罰', 'フョードル・ドストエフスキー', '978-0000000001', '貧しい元大学生ラスコーリニコフが、独自の理論に基づいて殺人を犯し、その後の苦悩と救済を描いた長編小説。', 'yamada@example.com'),
        ('高慢と偏見', 'ジェーン・オースティン', '978-0000000002', '18世紀末から19世紀初頭のイギリスの片田舎を舞台に、誤解と偏見から起こる恋のすれ違いを描いた恋愛小説の傑作。', 'yamada@example.com'),
        ('1984年', 'ジョージ・オーウェル', '978-0000000003', '全体主義国家によって監視・統制される近未来の恐怖を描いたディストピア小説。', 'yamada@example.com'),
        ('グレート・ギャツビー', 'F・スコット・フィッツジェラルド', '978-0000000004', '1920年代のニューヨーク郊外を舞台に、謎の大富豪ギャツビーの栄光と悲劇を描いたアメリカ文学の代表作。', 'yamada@example.com'),
        /* 佐藤花子の書籍（5-8） */
        ('百年の孤独', 'ガブリエル・ガルシア＝マルケス', '978-0000000005', '架空の村マコンドを舞台に、ブエンディア家の一族が経る栄枯盛衰の100年を描いたマジックリアリズムの傑作。', 'sato@example.com'),
        ('ライ麦畑でつかまえて', 'J.D.サリンジャー', '978-0000000006', '学校を退学になった16歳の少年ホールデン・コールフィールドの、ニューヨークでの3日間の放浪と心の揺れ動きを描く。', 'sato@example.com'),
        ('老人と海', 'アーネスト・ヘミングウェイ', '978-0000000007', 'キューバの老漁師サンチャゴと巨大なカジキマグロとの死闘、そしてサメとの戦いを描いた中編小説。', 'sato@example.com'),
        ('変身', 'フランツ・カフカ', '978-0000000008', 'ある朝目覚めると巨大な毒虫になっていた男グレゴール・ザムザと、その家族の奇妙な運命を描く不条理文学。', 'sato@example.com'),
        /* 鈴木一郎の書籍（9-12） */
        ('星の王子さま', 'アントワーヌ・ド・サン＝テグジュペリ', '978-0000000009', '砂漠に不時着した飛行士が出会った、小さな星から来た王子さまとの対話を通じて、人生で大切なことを描く物語。', 'suzuki@example.com'),
        ('異邦人', 'アルベール・カミュ', '978-0000000010', '「きょう、ママンが死んだ」という書き出しで知られる、不条理な殺人を犯した男ムルソーの運命を描く。', 'suzuki@example.com'),
        ('アンナ・カレーニナ', 'レフ・トルストイ', '978-0000000011', '19世紀後半のロシアを舞台に、政府高官の妻アンナと青年将校ヴロンスキーの不倫の恋と破滅を描く、リアリズム文学の最高峰。', 'suzuki@example.com'),
        ('レ・ミゼラブル', 'ヴィクトル・ユーゴー', '978-0000000012', '1本のパンを盗んだ罪で19年間服役したジャン・バルジャンの生涯と、彼を取り巻く人々の群像を描いた大河小説。', 'suzuki@example.com'),
        /* 田中美咲の書籍（13-16） */
        ('カラマーゾフの兄弟', 'フョードル・ドストエフスキー', '978-0000000013', '強欲な父フョードル殺害をめぐり、性格の異なる三兄弟と私生児の相克を描いた、ドストエフスキー最後の長編小説。', 'tanaka@example.com'),
        ('ドン・キホーテ', 'ミゲル・デ・セルバンテス', '978-0000000014', '騎士道物語を読みすぎて狂気にとらわれた郷士アロンソ・キハーノが、ドン・キホーテと名乗って旅に出る冒険物語。', 'tanaka@example.com'),
        ('ハムレット', 'ウィリアム・シェイクスピア', '978-0000000015', '父王を毒殺されたデンマークの王子ハムレットが、叔父への復讐を誓いながらも苦悩し、狂気を装う悲劇。', 'tanaka@example.com'),
        ('嵐が丘', 'エミリー・ブロンテ', '978-0000000016', 'ヨークシャーの荒野にある屋敷「嵐が丘」を舞台に、ヒースクリフとキャサリンの激しくも歪んだ愛と復讐を描く。', 'tanaka@example.com'),
        /* 高橋健太の書籍（17-20） */
        ('赤と黒', 'スタンダール', '978-0000000017', '王政復古期のフランスを舞台に、野心に燃える平民の青年ジュリアン・ソレルの立身出世と破滅を描く。', 'takahashi@example.com'),
        ('魔の山', 'トーマス・マン', '978-0000000018', 'スイスのサナトリウムを訪れた青年ハンス・カストルプが、そこで過ごす7年間の精神的な成長と第一次世界大戦への予兆を描く。', 'takahashi@example.com'),
        ('失われた時を求めて', 'マルセル・プルースト', '978-0000000019', '紅茶に浸したマドレーヌの味から過去の記憶が呼び覚まされ、語り手「私」の半生と社交界の人間模様が描かれる長編小説。', 'takahashi@example.com'),
        ('若きウェルテルの悩み', 'ヨハン・ヴォルフガング・フォン・ゲーテ', '978-0000000020', '婚約者のいる女性ロッテに恋をした青年ウェルテルが、叶わぬ恋に苦悩し、自ら命を絶つまでを描いた書簡体小説。', 'takahashi@example.com')
    ) AS b(title, author, isbn, description, owner_email)
JOIN
    user_list u ON u.email = b.owner_email
WHERE NOT EXISTS (
    SELECT 1 FROM books WHERE books.isbn = b.isbn
);
