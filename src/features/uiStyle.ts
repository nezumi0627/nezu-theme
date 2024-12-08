import * as vscode from 'vscode';

// UI要素のスタイル生成を担当
export class UIStyle {
    public static generate(): string {
        const config = vscode.workspace.getConfiguration('nezuTheme');
        const uiElements = {
            editor: config.get('uiElements.editor', true),
            sidebar: config.get('uiElements.sidebar', true),
            activityBar: config.get('uiElements.activityBar', true),
            panel: config.get('uiElements.panel', true),
            statusBar: config.get('uiElements.statusBar', true),
            titleBar: config.get('uiElements.titleBar', true)
        };

        return `
        /* 基本的なUI要素 */
        ${this.generateBasicUIStyles(uiElements)}

        /* 通知とポップアップ */
        .notifications-toasts {
            background-color: rgba(30, 30, 30, 0.7) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .notification-toast {
            background-color: rgba(30, 30, 30, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .monaco-workbench .notifications-list-container {
            background-color: rgba(30, 30, 30, 0.7) !important;
        }

        /* コマンドパレット */
        .quick-input-widget {
            background-color: rgba(30, 30, 30, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .quick-input-list {
            background-color: transparent !important;
        }

        /* ドロップダウンとメニュー */
        .monaco-dropdown,
        .monaco-dropdown-with-primary,
        .context-view.monaco-menu-container,
        .monaco-select-box-dropdown-container {
            background-color: rgba(30, 30, 30, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        /* リストアイテム */
        .monaco-list-row {
            background-color: transparent !important;
        }
        .monaco-list.list_id_1 .monaco-list-row.selected,
        .monaco-list.list_id_2 .monaco-list-row.selected {
            background-color: rgba(51, 153, 255, 0.2) !important;
        }
        .monaco-list-row:hover:not(.selected) {
            background-color: rgba(90, 93, 94, 0.31) !important;
        }

        /* スクロールバー */
        .monaco-scrollable-element > .scrollbar,
        .monaco-scrollable-element > .scrollbar > .slider {
            background-color: rgba(121, 121, 121, 0.4) !important;
        }

        /* ツールチップ */
        .monaco-tooltip {
            background-color: rgba(30, 30, 30, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        /* 検索ウィジェット */
        .monaco-workbench .search-view .search-widgets-container {
            background-color: rgba(30, 30, 30, 0.7) !important;
        }

        /* ステータスメッセージ */
        .monaco-workbench .part.statusbar .statusbar-item.has-background-color {
            background-color: transparent !important;
        }

        /* 半透明オーバーレイ（有効な要素のみ） */
        ${this.generateOverlayStyles(uiElements)}
        `;
    }

    private static generateBasicUIStyles(uiElements: any): string {
        return `
        /* アクティビティバー */
        .monaco-workbench .part.activitybar {
            background-color: ${uiElements.activityBar ? 'transparent' : '#333333'} !important;
        }

        /* サイドバー全体とその要素 */
        .monaco-workbench .part.sidebar,
        .monaco-workbench .part.sidebar > .title,
        .monaco-workbench .part.sidebar .composite.title,
        .monaco-workbench .part.sidebar .content,
        .monaco-workbench .part.sidebar .monaco-list,
        .monaco-workbench .part.sidebar .split-view-view {
            background-color: ${uiElements.sidebar ? 'transparent' : '#252526'} !important;
        }

        /* パネル全体とその要素 */
        .monaco-workbench .part.panel,
        .monaco-workbench .part.panel > .title,
        .monaco-workbench .part.panel > .content {
            background-color: ${uiElements.panel ? 'transparent' : '#252526'} !important;
        }

        /* ステータスバー */
        .monaco-workbench .part.statusbar {
            background-color: ${uiElements.statusBar ? 'transparent' : '#007acc'} !important;
        }

        /* タイトルバー */
        .monaco-workbench .part.titlebar {
            background-color: ${uiElements.titleBar ? 'transparent' : '#3c3c3c'} !important;
        }`;
    }

    private static generateOverlayStyles(uiElements: any): string {
        return `
        ${uiElements.activityBar ? '.monaco-workbench .part.activitybar { background-color: rgba(30, 30, 30, 0.6) !important; }' : ''}
        ${uiElements.sidebar ? `
            .monaco-workbench .part.sidebar { background-color: rgba(30, 30, 30, 0.6) !important; }
            .monaco-workbench .part.sidebar > .title { background-color: rgba(30, 30, 30, 0.6) !important; }
            .monaco-workbench .part.sidebar .content { background-color: rgba(30, 30, 30, 0.6) !important; }
        ` : ''}
        ${uiElements.panel ? `
            .monaco-workbench .part.panel { background-color: rgba(30, 30, 30, 0.6) !important; }
            .monaco-workbench .part.panel > .title { background-color: rgba(30, 30, 30, 0.6) !important; }
            .monaco-workbench .part.panel > .content { background-color: rgba(30, 30, 30, 0.6) !important; }
        ` : ''}
        ${uiElements.statusBar ? '.monaco-workbench .part.statusbar { background-color: rgba(30, 30, 30, 0.6) !important; }' : ''}
        ${uiElements.titleBar ? '.monaco-workbench .part.titlebar { background-color: rgba(30, 30, 30, 0.6) !important; }' : ''}`;
    }
} 