# mkwkdir

作業フォルダーを作成するための、Visual Studio Code(vscode)の拡張機能です。

vscode で開発する際には、必ず作業▼フォルダーを開く必要があります。

例えば、vscode を使って技術的なブログの記事を書いているとします。

その時に、技術的に試さないといけない事が発生しました。どうしますか?

私は以下のステップで、vscodeで新しい作業フォルダーを作成して、そのプロジェクト内で技術的な検証を行います。

1. vscodeで新しいウィンドウを開く
2. 新しいvscodeで`フォルダーを開く`を選び、新規作成した作業フォルダーを開く
   1. 作業フォルダーを作りたい場所まで移動
   2. 新しい作業フォルダーを作成
   3. 作成したフォルダーを開く

この`作業フォルダーを作成し開く`という作業を簡単にするのが、この拡張機能の目的です。

本拡張機能では、作業フォルダーの種類を以下に分類しています。

- プロダクト(product): ソフトウェア開発用
- ツール(tools): 簡単なツール開発用
- 勉強(learning): 言語やツールなどの学習用(チュートリアルなどの実施用)
- 実験(spike): 技術的な調査や実験用
- リソース(res): 資料や素材などの収集用

## Features

### コマンド

本拡張機能は、コマンドパレットから以下のコマンドを呼び出して使用します。
コマンドを実行すると、`作業フォルダー名`の入力を求められるので入力してください。

|拡張機能名|コマンド|説明|
|---|---|---|
|mkwkdir|mkdir for producsts|プロダクト(product): ソフトウェア開発用作業フォルダーを作成|
|mkwkdir|mkdir for tools|ツール(tools): 簡単なツール開発用作業フォルダーを作成|
|mkwkdir|mkdir for learning|勉強(learning): 言語やツールなどの学習用(チュートリアルなどの実施用)作業フォルダーを作成|
|mkwkdir|mkdir for spike|技術的な調査や実験用作業フォルダーを作成|
|mkwkdir|mkdir for resources|資料や素材などの収集用作業フォルダーを作成|
|mkwkdir|open dir for producsts|プロダクト(product): 一覧からソフトウェア開発用作業フォルダーを選択して開く|
|mkwkdir|open dir for tools|ツール(tools): 一覧から簡単なツール開発用作業フォルダーを選択して開く|
|mkwkdir|open dir for learning|勉強(learning): 一覧から言語やツールなどの学習用(チュートリアルなどの実施用)作業フォルダーを選択して開く|
|mkwkdir|open dir for spike|一覧から技術的な調査や実験用作業フォルダーを選択して開く|
|mkwkdir|open dir for resources|一覧から資料や素材などの収集用作業フォルダーを選択して開く|

### 設定

本拡張機能は、作業フォルダー分類ごとのベースフォルダーパスを設定できる。

デフォルトでは、以下のベースフォルダーパスが設定されている。
また、ベースフォルダーパスの設定値内の`${userHome}`はプレイスフォルダーとなっており、`os.homedir()`の値に置換される。

|設定|デフォルト値|説明|
|---|---|---|
|mkwkdir.productsPath|`${userHome}/hacking/products`|プロダクト用作業フォルダーのベースフォルダー|
|mkwkdir.toolsPath|`${userHome}/hacking/tools`|ツール用作業フォルダーのベースフォルダー|
|mkwkdir.learningPath|`${userHome}/hacking/learning`|学習用作業フォルダーのベースフォルダー|
|mkwkdir.spikePath|`${userHome}/hacking/spike`|調査用作業フォルダーのベースフォルダー|
|mkwkdir.resourcesPath|`${userHome}/hacking/res`|収集用作業フォルダーのベースフォルダー|

## インストール方法

以下を実行し、ソースコードから`vsix`ファイルを作成します。

~~~shell
% npm run package

> mkwkdir@0.0.x package
> npx vsce pack --allow-missing-repository --skip-license

 DONE  Packaged: /Users/kanta/spike/86_make-wkdir/mkwkdir-0.0.x.vsix (7 files, 5.62KB)
~~~

`mkwkdir-0.0.x.vsix`が作成されるので、[Install from a VSIX | Managing Extensions in Visual Studio Code](https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix)に従い、以下のいずれかの方法でインストールしてください。

### 拡張機能サイドバーからインストール

拡張機能サイドバーの右上にある`...`をクリックし、表示されるメニューから
`VSIXからのインストール`を選択する。

ファイル選択ダイアログが表示されるので、`mkwkdir-0.0.x.vsix`を選択しインストールする。

### コマンドラインからインストール

以下のコマンドを実行してインストールする。

~~~shell
code --install-extension mkwkdir-0.0.x.vsix
~~~
