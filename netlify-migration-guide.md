---
description: 既存のNetlifyサイトから新しいプロジェクトへ独自ドメインを移行する手順
---

現在公開中のサイト（yori-somaru.com）を、今回作成した新しいプロジェクトに切り替える手順です。

### ステップ1：最新のコードをGitHubにプッシュする
NetlifyはGitHubのリポジトリと連携させるのが最も安全で簡単です。
1. VS Codeのソース管理（Git）から、これまでの変更をすべて「コミット」し、「プッシュ」します。
2. これにより、GitHub上のリポジトリが最新の状態になります。
   > [!NOTE]
   > まだGitHubにリポジトリがない場合は、[GitHub](https://github.com/new)で新しいリポジトリを作成し、このプロジェクトをプッシュしてください。

### ステップ2：Netlifyで新しいサイトを作成する
1. [Netlify ダッシュボード](https://app.netlify.com/)にログインします。
2. **「Add new site」** ボタンを押し、**「Import an existing project」** を選択します。
3. **「GitHub」** を選択し、認証して今回のリポジトリ（`resonance-psychologist` など）を選択します。
4. **Build settings** の画面で、以下の情報を正確に入力します：
   - **Runtime**: `Not set` (デフォルトのままでOK)
   - **Base directory**: (空欄のままでOK)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: (空欄のままでOK)
5. 画面最下部の **「Deploy サイト名」** をクリックします。

> [!TIP]
> **なぜ `dist` なのか？**
> Viteというツールを使ってサイトをビルドすると、公開用のファイルがすべて `dist` というフォルダに書き出されます。Netlifyには「その `dist` フォルダの中身をウェブサイトとして公開してね」と指示していることになります。

### ステップ3：独自ドメインを付け替える
ここが最も重要なステップです。**旧サイトからドメインを外し、新サイトに付け直します。**

1. **旧サイトの設定変更**
   - Netlifyで既存の（古い）サイトを開きます。
   - 「Site configuration」→「Domain management」→「Domains」に移動します。
   - 独自ドメイン（`yori-somaru.com`）の横にある「Options」から **「Remove domain」** を選択して、一旦削除します。
2. **新サイトの設定変更**
   - 新しく作ったサイトを開きます。
   - 「Site configuration」→「Domain management」→「Domains」に移動します。
   - 「Add a domain」をクリックし、`yori-somaru.com` を入力して追加します。
3. **SSLの更新**
   - ドメイン追加後、同じ画面の下の方にある「HTTPS」セクションで「Verify DNS configuration」を押すと、自動的に新しいサイト用のSSL証明書（HTTPS）が発行されます。

### ステップ4：旧サイトの削除
新サイトが `yori-somaru.com` で正常に表示されることを確認したら、古いサイトを削除しても問題ありません。
- 旧サイトの「Site configuration」→「Danger zone」→「Delete this site」から削除できます。

> [!IMPORTANT]
> ドメインの付け替え直後は、世界中のサーバーに反映されるまで数分〜数時間かかる場合があります。ブラウザのキャッシュにより古いサイトが表示されることもあるので、シークレットブラウザ等で確認してください。
