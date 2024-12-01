// 背景画像のスタイル生成を担当
export class BackgroundStyle {
    public static generate(imagePath: string, opacity: number, blur: number): string {
        return `
        /* リセット用のスタイル */
        .monaco-workbench {
            background-color: transparent !important;
        }

        /* 背景画像 */
        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -9999;
            background-image: url('${this.processImagePath(imagePath)}');
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            opacity: ${opacity};
            filter: blur(${blur}px);
            pointer-events: none;
        }`;
    }

    private static processImagePath(imagePath: string): string {
        if (imagePath.startsWith('https://')) {
            return imagePath;
        }
        const normalizedPath = imagePath.replace(/\\/g, '/');
        return `vscode-file://vscode-app/${normalizedPath}`;
    }
} 