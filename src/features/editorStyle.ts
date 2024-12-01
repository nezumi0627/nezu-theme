// エディタ関連のスタイル生成を担当
export class EditorStyle {
    public static generate(): string {
        return `
        /* エロィタの影を削除 */
        .monaco-editor,
        .monaco-editor .overflow-guard,
        .monaco-editor-background,
        .monaco-workbench .part.editor > .content {
            box-shadow: none !important;
        }

        /* エディタの実際のテキスト領域 */
        .monaco-editor .overflow-guard > .monaco-scrollable-element {
            background-color: rgba(30, 30, 30, 0.6) !important;
            box-shadow: none !important;
        }

        /* エディタのウィジェット */
        .monaco-editor .suggest-widget,
        .monaco-editor .monaco-hover,
        .monaco-editor .parameter-hints-widget {
            background-color: rgba(30, 30, 30, 0.95) !important;
            box-shadow: none !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        /* エディタのガター（行番号部分） */
        .monaco-editor .margin,
        .monaco-editor .glyph-margin,
        .monaco-editor .margin-view-overlays {
            background-color: rgba(30, 30, 30, 0.6) !important;
            box-shadow: none !important;
        }

        /* エディタの選択範囲 */
        .monaco-editor .selected-text,
        .monaco-editor .selectionHighlight {
            background-color: rgba(58, 61, 65, 0.6) !important;
        }

        /* エディタのカーソル行 */
        .monaco-editor .current-line,
        .monaco-editor .view-overlays .current-line {
            background-color: rgba(40, 40, 40, 0.6) !important;
            border: none !important;
        }

        /* スクロールバーの影を削除 */
        .monaco-scrollable-element > .scrollbar,
        .monaco-scrollable-element > .scrollbar > .slider {
            box-shadow: none !important;
        }
        `;
    }
} 