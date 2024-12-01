import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

export class BackgroundHelper {
    private readonly jsName: string = 'workbench.desktop.main.js';
    private readonly bakName: string = 'workbench.desktop.main.js.bak';
    private readonly jsPath: string;
    private readonly bakPath: string;

    constructor() {
        this.jsPath = path.join(vscode.env.appRoot, "out", "vs", "workbench", this.jsName);
        this.bakPath = path.join(vscode.env.appRoot, "out", "vs", "workbench", this.bakName);
    }

    public async apply(imagePath: string, opacity: number, blur: number): Promise<boolean> {
        try {
            console.log('Applying background:', {
                imagePath,
                opacity,
                blur,
                jsPath: this.jsPath
            });

            const content = await fs.readFile(this.jsPath, 'utf-8');
            const cleanContent = this.clearCustomContent(content);
            const newContent = cleanContent + this.generateContent(imagePath, opacity, blur);
            await this.backupFile();
            await this.updateFile(newContent);

            console.log('Background applied successfully');
            return true;
        } catch (error: unknown) {
            console.error('Failed to apply background:', error);
            vscode.window.showErrorMessage(`Failed to apply background: ${error instanceof Error ? error.message : String(error)}`);
            return false;
        }
    }

    public async remove(): Promise<boolean> {
        try {
            console.log('Removing background');

            const content = await fs.readFile(this.jsPath, 'utf-8');
            const cleanContent = this.clearCustomContent(content);
            await this.updateFile(cleanContent);

            console.log('Background removed successfully');
            return true;
        } catch (error: unknown) {
            console.error('Failed to remove background:', error);
            vscode.window.showErrorMessage(`Failed to remove background: ${error instanceof Error ? error.message : String(error)}`);
            return false;
        }
    }

    private generateContent(imagePath: string, opacity: number, blur: number): string {
        const css = `
        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${this.processImagePath(imagePath)}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: ${opacity};
            filter: blur(${blur}px);
            pointer-events: none;
            z-index: 99999;
        }`;

        return `
        /*nezu-theme-start*/
        const style = document.createElement('style');
        style.textContent = \`${css}\`;
        document.head.appendChild(style);
        /*nezu-theme-end*/
        `;
    }

    private async backupFile(): Promise<void> {
        if (!await fs.pathExists(this.bakPath)) {
            await fs.copy(this.jsPath, this.bakPath);
        }
    }

    private async updateFile(content: string): Promise<void> {
        try {
            await fs.writeFile(this.jsPath, content, 'utf-8');
        } catch (error: unknown) {
            if (error instanceof Error && 'code' in error && error.code === 'EACCES') {
                await this.handlePermissionError();
                await fs.writeFile(this.jsPath, content, 'utf-8');
            } else {
                throw error;
            }
        }
    }

    private async handlePermissionError(): Promise<void> {
        const platform = os.type();
        if (platform === 'Windows_NT') {
            await this.execCommand(`icacls "${this.jsPath}" /grant Users:F`);
        } else if (platform === 'Darwin' || platform === 'Linux') {
            await this.execCommand(`chmod 666 "${this.jsPath}"`);
        }
    }

    private async execCommand(command: string): Promise<void> {
        const { exec } = require('child_process');
        return new Promise((resolve, reject) => {
            exec(command, (error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    private processImagePath(imagePath: string): string {
        if (imagePath.startsWith('https://')) {
            return imagePath;
        }
        const platform = os.type();
        const separator = platform === 'Linux' ? '' : '/';
        return `vscode-file://vscode-app${separator}${imagePath}`;
    }

    private clearCustomContent(content: string): string {
        const regex = /\/\*nezu-theme-start\*\/[\s\S]*?\/\*nezu-theme-end\*\//g;
        return content.replace(regex, '').trim();
    }

    private generateCSS(imagePath: string, opacity: number, blur: number): string {
        return `
        .monaco-workbench {
            background-color: transparent !important;
        }
        
        .monaco-workbench::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${this.processImagePath(imagePath)}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: ${opacity};
            filter: blur(${blur}px);
            pointer-events: none;
            z-index: -1;
        }

        .monaco-workbench .part.editor > .content {
            background-color: rgba(30, 30, 30, 0.6) !important;
        }

        .monaco-workbench .part.sidebar {
            background-color: rgba(30, 30, 30, 0.7) !important;
        }

        .monaco-workbench .part.activitybar {
            background-color: rgba(30, 30, 30, 0.8) !important;
        }
        `;
    }
} 