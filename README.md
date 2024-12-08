# Nezu Theme - VS Code Background Extension

[English](./README_EN.md) | [日本語](./README.md)

VS Codeのバックグラウンドに画像を設定できる拡張機能です。

## 特徴

- 背景画像のカスタマイズ
- 透明度とぼかし効果の調整
- UI要素ごとの表示/非表示設定
- 日本語/英語の言語切り替え
- 自動背景更新機能

## 使用方法

1. コマンドパレット（Ctrl+Shift+P）で "Nezu Theme - Configure" を実行
2. 以下のオプションから選択:
   - 背景画像の選択
   - 画像ディレクトリの選択（ランダム切り替え用）
   - 透明度の設定 (0-0.8)
   - ぼかし効果の設定 (0-100)
   - UI要素の表示設定
   - 自動更新の有効/無効

## 設定項目

- `nezuTheme.opacity`: 背景の不透明度 (0-0.8)
- `nezuTheme.blur`: 背景のぼかし効果 (0-100)
- `nezuTheme.imagePath`: 背景画像のパス
- `nezuTheme.autoStatus`: 起動時の自動更新
- `nezuTheme.language`: 表示言語 (en/ja)
- `nezuTheme.uiElements`: UI要素の表示設定
  - editor: エディタ
  - sidebar: サイドバー
  - activityBar: アクティビティバー
  - panel: パネル
  - statusBar: ステータスバー
  - titleBar: タイトルバー

## キーボードショートカット

- `Ctrl+Shift+F7`: 背景画像のランダム切り替え（ディレクトリ設定時）

## 注意事項

- VS Code内部ファイルを修正するため、VS Codeの更新時に設定がリセットされる場合があります
- 設定変更後はVS Codeの再起動が必要です
- バックアップファイル（.bak）は自動的に作成されます

## ライセンス

MIT License 