import * as vscode from 'vscode';
import { ThemeManager } from './themeManager';
import { strings } from './i18n/loader';

export async function activate(context: vscode.ExtensionContext) {
    console.log('[Nezu Theme] Activating extension...');
    
    const themeManager = new ThemeManager();

    // 初期化時に設定を適用
    await themeManager.applyCurrentTheme();

    // ステータスバーアイテムを作成
    let backImgBtn = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -999);
    backImgBtn.text = '$(file-media)';
    backImgBtn.command = 'nezu-theme.start';
    backImgBtn.tooltip = 'Switch background image';
    backImgBtn.show();

    // コマンドを登録
    let startCommand = vscode.commands.registerCommand('nezu-theme.start', () => {
        themeManager.showThemeOptions();
    });

    let refreshCommand = vscode.commands.registerCommand('nezu-theme.refresh', () => {
        themeManager.randomUpdateBackground();
    });

    // 設定変更の監視を追加
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(async e => {
            if (e.affectsConfiguration('nezuTheme')) {
                await themeManager.applyCurrentTheme();
            }
        })
    );

    context.subscriptions.push(startCommand, refreshCommand, backImgBtn);
    console.log('[Nezu Theme] Extension activated successfully');
}

export function deactivate() { } 