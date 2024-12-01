import { BackgroundStyle } from './backgroundStyle';
import { EditorStyle } from './editorStyle';
import { UIStyle } from './uiStyle';

export class StyleManager {
    public static generateCSS(imagePath: string, opacity: number, blur: number): string {
        return `
            /* すべての要素を透明化 */
            * {
                background-color: #00000000 !important;
            }

            /* 背景画像のスタイル */
            ${BackgroundStyle.generate(imagePath, opacity, blur)}

            /* 必要な背景色を持つUI要素 */
            ${UIStyle.generate()}

            /* エディタ関連の背景色 */
            ${EditorStyle.generate()}
        `;
    }

    public static generateScript(css: string): string {
        return `
        /*nezu-theme-start*/
        (function() {
            try {
                const style = document.createElement('style');
                style.id = 'nezu-theme-style';
                style.textContent = \`${css}\`;
                
                const existingStyle = document.getElementById('nezu-theme-style');
                if (existingStyle) {
                    existingStyle.remove();
                }
                
                document.head.appendChild(style);

                const observer = new MutationObserver(() => {
                    if (!document.getElementById('nezu-theme-style')) {
                        document.head.appendChild(style.cloneNode(true));
                    }
                });

                observer.observe(document.head, {
                    childList: true,
                    subtree: true
                });
            } catch (e) {
                console.error('[Nezu Theme] Failed to apply styles:', e);
            }
        })();
        /*nezu-theme-end*/
        `;
    }
} 