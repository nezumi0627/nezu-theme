import * as vscode from 'vscode';
import { strings } from '../i18n/loader';

export class NotificationHelper {
    private static lastNotificationTime: number = 0;
    private static readonly NOTIFICATION_COOLDOWN: number = 2000;

    private static getLanguage(): 'en' | 'ja' {
        return vscode.workspace.getConfiguration('nezuTheme').get('language', 'en') as 'en' | 'ja';
    }

    public static async showReloadPrompt(): Promise<boolean> {
        const currentTime = Date.now();
        if (currentTime - this.lastNotificationTime < this.NOTIFICATION_COOLDOWN) {
            return false;
        }

        this.lastNotificationTime = currentTime;
        const lang = this.getLanguage();
        const i18n = strings[lang].notifications;

        const result = await vscode.window.showInformationMessage(
            i18n.reloadPrompt,
            i18n.reloadYes,
            i18n.reloadNo
        );

        if (result === i18n.reloadYes) {
            await vscode.commands.executeCommand('workbench.action.reloadWindow');
            return true;
        }

        return false;
    }

    public static async showError(error: unknown): Promise<void> {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // 両方の言語のエラーメッセージを取得
        const enPrefix = strings.en.notifications.errorPrefix;
        const jaPrefix = strings.ja.notifications.errorPrefix;

        // 両方の言語でメッセージを表示
        const message = `${enPrefix} ${errorMessage}\n${jaPrefix} ${errorMessage}`;
        
        await vscode.window.showErrorMessage(message, { modal: true });
    }
} 