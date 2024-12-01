// UI要素のスタイル生成を担当
export class UIStyle {
    public static generate(): string {
        return `
        /* UI要素の背景 */
        .monaco-workbench .part.editor > .content,
        .monaco-workbench .part.sidebar,
        .monaco-workbench .part.activitybar,
        .monaco-workbench .part.panel,
        .monaco-workbench .part.statusbar,
        .monaco-workbench .part.titlebar {
            background-color: rgba(30, 30, 30, 0.6) !important;
        }`;
    }
} 