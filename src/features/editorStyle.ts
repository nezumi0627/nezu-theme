// エディタ関連のスタイル生成を担当
export class EditorStyle {
    public static generate(): string {
        return `
        /* エディタの背景 */
        .monaco-editor,
        .monaco-editor .overflow-guard,
        .monaco-editor-background {
            background-color: transparent !important;
        }

        /* エディタのコンテンツ領域 */
        .monaco-editor .overflow-guard > .monaco-scrollable-element {
            background-color: rgba(30, 30, 30, 0.6) !important;
        }

        /* エディタのウィジェット */
        .monaco-editor .suggest-widget,
        .monaco-editor .monaco-hover {
            background-color: rgba(30, 30, 30, 0.95) !important;
        }`;
    }
} 