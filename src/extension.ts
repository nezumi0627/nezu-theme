import * as vscode from 'vscode';
import { ThemeManager } from './themeManager';

export function activate(context: vscode.ExtensionContext) {
    const themeManager = new ThemeManager();

    // ステータスバーアイテムを作成
    let backImgBtn = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -999);
    backImgBtn.text = '$(file-media)';
    backImgBtn.command = 'nezu-theme.start';
    backImgBtn.tooltip = 'Switch background image';
    backImgBtn.show();

    // 自動更新の確認
    themeManager.autoUpdateBackground();

    // コマンドを登録
    let startCommand = vscode.commands.registerCommand('nezu-theme.start', () => {
        themeManager.showThemeOptions();
    });

    let refreshCommand = vscode.commands.registerCommand('nezu-theme.refresh', () => {
        themeManager.randomUpdateBackground();
    });

    context.subscriptions.push(startCommand, refreshCommand, backImgBtn);
}

export function deactivate() { } 