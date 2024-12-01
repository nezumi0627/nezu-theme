import * as vscode from 'vscode';
import { ThemeManager } from './themeManager';
import { strings } from './i18n/loader';

export function activate(context: vscode.ExtensionContext) {
    const themeManager = new ThemeManager();

    // 言語設定に基づいて設定の説明を更新する関数
    function updateConfigurationDescriptions() {
        const lang = vscode.workspace.getConfiguration('nezuTheme').get('language', 'en');
        const i18n = strings[lang as 'en' | 'ja'];

        // 設定の説明を更新
        const config = vscode.workspace.getConfiguration();
        config.update('nezuTheme.opacity.description', i18n.ui.configOpacityDesc, true);
        config.update('nezuTheme.blur.description', i18n.ui.configBlurDesc, true);
        // ... 他の設定の説明も更新
    }

    // ステータスバーアイテムを作成
    let backImgBtn = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -999);
    backImgBtn.text = '$(file-media)';
    backImgBtn.command = 'nezu-theme.start';
    backImgBtn.tooltip = 'Switch background image';
    backImgBtn.show();

    // コマンド登録
    let startCommand = vscode.commands.registerCommand('nezu-theme.start', () => {
        themeManager.showThemeOptions();
    });

    let refreshCommand = vscode.commands.registerCommand('nezu-theme.refresh', () => {
        themeManager.randomUpdateBackground();
    });

    // 設定変更の監視を追加
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(async e => {
            if (e.affectsConfiguration('nezuTheme.language')) {
                const currentLang = vscode.workspace.getConfiguration('nezuTheme').get('language', 'en');
                const newLang = currentLang === 'en' ? 'ja' : 'en';

                // 両方の言語のメッセージを取得
                const enMessage = strings.en.notifications.languageChanged;
                const jaMessage = strings.ja.notifications.languageChanged;

                // 両方の言語でメッセージを表示
                const message = `${enMessage}\n${jaMessage}`;
                const selected = await vscode.window.showInformationMessage(
                    message,
                    { modal: true }, // モーダルダイアログとして表示
                    'Yes / はい',
                    'No / いいえ'
                );

                if (selected === 'Yes / はい') {
                    // 設定の説明を更新
                    await updateConfigurationDescriptions();
                    await vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            }
        })
    );

    // 初期化時にも設定の説明を更新
    updateConfigurationDescriptions();

    context.subscriptions.push(startCommand, refreshCommand, backImgBtn);
}

export function deactivate() { } 