# Nezu Theme - VS Code Background Extension

[English](./README_EN.md) | [日本語](./README.md)

VS Codeのバックグラウンドに画像を設定できる拡張機能です。

## 仕組み

この拡張機能は以下の方法でVS Codeの背景画像を実現しています：

1. **背景画像の適用プロセス**:
   - VS Codeの内部ファイル（workbench.desktop.main.js）を修正
   - CSSとJavaScriptを注入して背景画像を設定
   - 元のファイルはバックアップを作成（.bak）

2. **主要なコンポーネント**:
   - `BackgroundHelper`: ファイル操作とスタイル注入を担当
   - `ThemeManager`: 設定の管理とUIの制御
   - `ThemeStyles`: CSSスタイルの生成

3. **スタイリングの仕組み**:
   ```css
   /* 背景画像の設定 */
   .monaco-workbench::before {
       content: '';
       position: fixed;
       width: 100vw;
       height: 100vh;
       background-image: url('...');
       /* その他のスタイル */
   }
   ```

4. **透明度の制御**:
   - エディタ: rgba(30, 30, 30, 0.6)
   - サイドバー: rgba(30, 30, 30, 0.7)
   - その他のUI要素: 適切な透明度を設定

5. **設定可能な項目**:
   - 背景画像のパス
   - 不透明度（0-0.8）
   - ぼかし効果（0-100）
   - UI要素ごとの表示/非表示
   - 表示言語（英語/日本語）

## 使用方法

1. コマンドパレット（Ctrl+Shift+P）で "Nezu Theme - Configure" を実行
2. 以下のオプションから選択:
   - 背景画像の選択
   - 透明度の設定
   - ぼかし効果の設定
   - UI要素の表示設定

## 注意事項

- VS Code内部ファイルを修正するため、VS Codeの更新時に設定がリセットされる場合があります
- 設定変更後はVS Codeの再起動が必要です
- バックアップファイル（.bak）は自動的に作成されます

## 技術的な詳細

1. **ファイル構造**:
   ```
   nezu-theme/
   ├── src/
   │   ├── backgroundHelper.ts  // ファイル操作
   │   ├── themeManager.ts     // 設定管理
   │   └── styles/
   │       └── themeStyles.ts  // スタイル生成
   ```

2. **背景画像の適用フロー**:
   1. 画像パスの正規化
   2. CSSスタイルの生成
   3. スタイルをJSファイルに注入
   4. VS Code再起動で変更を適用

3. **エラーハンドリング**:
   - ファイルアクセス権の自動取得
   - バックアップファイルの作成
   - エラー通知の表示

## ライセンス

MIT License 