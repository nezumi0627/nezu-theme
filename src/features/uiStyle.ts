// UI要素のスタイル生成を担当
export class UIStyle {
    public static generate(): string {
        return `
        /* アクティビティバー */
        .monaco-workbench .part.activitybar {
            background-color: rgba(30, 30, 30, 0.6) !important;
        }

        /* サイドバーのヘッダー */
        .monaco-workbench .part.sidebar > .title {
            background-color: rgba(30, 30, 30, 0.6) !important;
        }

        /* パネル */
        .monaco-workbench .part.panel > .title {
            background-color: rgba(30, 30, 30, 0.6) !important;
        }

        /* ステータスバー */
        .monaco-workbench .part.statusbar {
            background-color: rgba(30, 30, 30, 0.6) !important;
        }

        /* タイトルバー */
        .monaco-workbench .part.titlebar {
            background-color: rgba(30, 30, 30, 0.6) !important;
        }

        /* ドロップダウンメニュー */
        .monaco-dropdown,
        .monaco-dropdown-with-primary {
            background-color: rgba(30, 30, 30, 0.95) !important;
        }

        /* コンテキストメニュー */
        .context-view.monaco-menu-container {
            background-color: rgba(30, 30, 30, 0.95) !important;
        }
        `;
    }
} 