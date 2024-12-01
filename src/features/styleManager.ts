import { BackgroundStyle } from './backgroundStyle';
import { EditorStyle } from './editorStyle';
import { UIStyle } from './uiStyle';

export class StyleManager {
    public static generateCSS(imagePath: string, opacity: number, blur: number): string {
        return `
            ${BackgroundStyle.generate(imagePath, opacity, blur)}
            ${EditorStyle.generate()}
            ${UIStyle.generate()}
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