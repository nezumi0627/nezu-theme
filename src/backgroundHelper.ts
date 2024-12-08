import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import { StyleManager } from './features/styleManager';

export class BackgroundHelper {
    private readonly jsName: string = 'workbench.desktop.main.js';
    private readonly bakName: string = 'workbench.desktop.main.js.bak';
    private readonly jsPath: string;
    private readonly bakPath: string;

    constructor() {
        const appRoot = this.getAppRoot();
        const isCursor = appRoot.includes('cursor');
        
        // Cursorとvscodeでパス構造が異なる
        if (isCursor) {
            this.jsPath = path.join(appRoot, "resources", "app", "out", "vs", "workbench", this.jsName);
            this.bakPath = path.join(appRoot, "resources", "app", "out", "vs", "workbench", this.bakName);
        } else {
            this.jsPath = path.join(appRoot, "out", "vs", "workbench", this.jsName);
            this.bakPath = path.join(appRoot, "out", "vs", "workbench", this.bakName);
        }

        // 初期化時のパス情報をログ出力
        console.log('[Nezu Theme] Initialized paths:', {
            appRoot,
            isCursor,
            jsPath: this.jsPath,
            bakPath: this.bakPath
        });
    }

    private getAppRoot(): string {
        // Cursorのパスを確認
        const cursorPath = path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'cursor');
        const vscodePath = process.env.VSCODE_CWD || vscode.env.appRoot;

        // パスの存在を確認してログ出力
        console.log('[Nezu Theme] Checking paths:', {
            cursorPath,
            vscodePath,
            cursorExists: fs.existsSync(cursorPath),
            vscodeExists: fs.existsSync(vscodePath)
        });

        // Cursorのパスが存在する場合はそちらを使用
        if (fs.existsSync(cursorPath)) {
            return cursorPath;
        }

        return vscodePath;
    }

    public async apply(imagePath: string, opacity: number, blur: number): Promise<boolean> {
        try {
            console.log('[Nezu Theme] Applying background:', {
                imagePath,
                opacity,
                blur,
                jsPath: this.jsPath
            });

            // ファイルの存在確認
            if (!await fs.pathExists(this.jsPath)) {
                const error = `workbench.desktop.main.js not found at: ${this.jsPath}`;
                console.error('[Nezu Theme] Error:', error);
                throw new Error(error);
            }

            // バックアップを作成
            await this.backupFile();
            console.log('[Nezu Theme] Backup created');

            // ファイルの内容を読み込む
            const content = await fs.readFile(this.jsPath, 'utf-8');
            const cleanContent = this.clearCssContent(content);
            const newContent = cleanContent + this.generateContent(imagePath, opacity, blur);

            // 更新を適用
            await this.updateFile(newContent);
            console.log('[Nezu Theme] Background applied successfully');
            return true;
        } catch (error) {
            console.error('[Nezu Theme] Failed to apply background:', error);
            throw error;
        }
    }

    public async remove(): Promise<boolean> {
        try {
            console.log('[Nezu Theme] Removing background');
            const content = await fs.readFile(this.jsPath, 'utf-8');
            const cleanContent = this.clearCssContent(content);
            await this.updateFile(cleanContent);
            console.log('[Nezu Theme] Background removed successfully');
            return true;
        } catch (error) {
            console.error('[Nezu Theme] Failed to remove background:', error);
            throw error;
        }
    }

    private async backupFile(): Promise<void> {
        try {
            if (!await fs.pathExists(this.bakPath)) {
                await fs.copy(this.jsPath, this.bakPath);
                console.log('[Nezu Theme] Backup file created:', this.bakPath);
            }
        } catch (error) {
            console.error('[Nezu Theme] Failed to create backup:', error);
            throw error;
        }
    }

    private async updateFile(content: string): Promise<void> {
        try {
            await fs.writeFile(this.jsPath, content, 'utf-8');
        } catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'EACCES') {
                console.log('[Nezu Theme] Permission error, attempting to fix...');
                await this.handlePermissionError();
                await fs.writeFile(this.jsPath, content, 'utf-8');
                console.log('[Nezu Theme] File updated after permission fix');
            } else {
                console.error('[Nezu Theme] Failed to update file:', error);
                throw error;
            }
        }
    }

    private async handlePermissionError(): Promise<void> {
        const platform = os.type();
        if (platform === 'Windows_NT') {
            await this.execCommand(`powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c icacls \\"${this.jsPath}\\" /grant Users:F'"`);
        } else if (platform === 'Darwin' || platform === 'Linux') {
            await this.execCommand(`sudo chmod 666 "${this.jsPath}"`);
        }
    }

    private async execCommand(command: string): Promise<void> {
        const { exec } = require('child_process');
        return new Promise((resolve, reject) => {
            exec(command, (error: any) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

    private generateContent(imagePath: string, opacity: number, blur: number): string {
        const css = StyleManager.generateCSS(imagePath, opacity, blur);
        return StyleManager.generateScript(css);
    }

    private clearCssContent(content: string): string {
        const regex = /\/\*nezu-theme-start\*\/[\s\S]*?\/\*nezu-theme-end\*\//g;
        return content.replace(regex, '').trim();
    }
} 