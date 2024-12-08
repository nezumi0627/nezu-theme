import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import { BackgroundHelper } from './backgroundHelper';
import { NotificationHelper } from './helpers/notificationHelper';
import { strings } from './i18n/loader';

export class ThemeManager {
    private config = vscode.workspace.getConfiguration('nezuTheme');
    private backgroundHelper: BackgroundHelper;

    constructor() {
        this.backgroundHelper = new BackgroundHelper();
    }

    private getLanguage(): 'en' | 'ja' {
        return this.config.get('language', 'en') as 'en' | 'ja';
    }

    public async showThemeOptions() {
        const lang = this.getLanguage();
        const i18n = strings[lang].ui;

        const options: vscode.QuickPickItem[] = [
            {
                label: `$(file-media) ${i18n.selectImage}`,
                description: i18n.selectImageDesc
            },
            {
                label: `$(folder) ${i18n.selectDir}`,
                description: i18n.selectDirDesc
            },
            {
                label: `$(settings) ${i18n.configOpacity}`,
                description: i18n.configOpacityDesc
            },
            {
                label: `$(settings) ${i18n.configBlur}`,
                description: i18n.configBlurDesc
            },
            {
                label: `$(list-selection) ${i18n.configUI}`,
                description: i18n.configUIDesc
            }
        ];

        if (this.config.get('autoStatus')) {
            options.push({
                label: `$(sync) ${i18n.disableAuto}`,
                description: i18n.disableAutoDesc
            });
        } else {
            options.push({
                label: `$(sync) ${i18n.enableAuto}`,
                description: i18n.enableAutoDesc
            });
        }

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: "Select theme option"
        });

        if (selected) {
            switch (selected.label) {
                case `$(file-media) ${i18n.selectImage}`:
                    await this.selectBackgroundImage();
                    break;
                case `$(folder) ${i18n.selectDir}`:
                    await this.selectImageDirectory();
                    break;
                case `$(settings) ${i18n.configOpacity}`:
                    await this.configureOpacity();
                    break;
                case `$(settings) ${i18n.configBlur}`:
                    await this.configureBlur();
                    break;
                case `$(sync) ${i18n.enableAuto}`:
                    await this.config.update('autoStatus', true, true);
                    break;
                case `$(sync) ${i18n.disableAuto}`:
                    await this.config.update('autoStatus', false, true);
                    break;
                case `$(list-selection) ${i18n.configUI}`:
                    await this.configureUIElements();
                    break;
            }
        }
    }

    public async autoUpdateBackground() {
        if (this.config.get('autoStatus')) {
            await this.randomUpdateBackground();
        }
    }

    public async randomUpdateBackground() {
        const imagePath = this.config.get<string>('imagePath');
        if (!imagePath) {
            vscode.window.showWarningMessage('No image path configured');
            return;
        }

        try {
            const stats = await fs.stat(imagePath);
            if (stats.isDirectory()) {
                const files = await fs.readdir(imagePath);
                const imageFiles = files.filter(file =>
                    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
                );

                if (imageFiles.length > 0) {
                    const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
                    const fullPath = path.join(imagePath, randomFile);
                    await this.config.update('imagePath', fullPath, true);
                    await this.applyCurrentTheme();
                }
            } else {
                await this.applyCurrentTheme();
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to update background: ${error}`);
        }
    }

    private async selectImageDirectory() {
        const result = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false
        });

        if (result && result[0]) {
            await this.config.update('imagePath', result[0].fsPath, true);
            await this.randomUpdateBackground();
        }
    }

    private async selectBackgroundImage() {
        const result = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            filters: {
                'Images': ['png', 'jpg', 'jpeg', 'gif', 'webp']
            }
        });

        if (result && result[0]) {
            await this.config.update('imagePath', result[0].fsPath, true);
            await this.applyCurrentTheme();
        }
    }

    private async configureOpacity() {
        const lang = this.getLanguage();
        const i18n = strings[lang].ui.placeholders;

        const opacity = await vscode.window.showInputBox({
            prompt: i18n.enterOpacity,
            value: this.config.get('opacity', 0.2).toString(),
            validateInput: (value: string) => {
                const num = parseFloat(value);
                return (num >= 0 && num <= 0.8) ? null : strings[lang].notifications.opacityError;
            }
        });

        if (opacity) {
            const value = parseFloat(opacity);
            await this.config.update('opacity', value, true);
            await this.applyCurrentTheme();
        }
    }

    private async configureBlur() {
        const lang = this.getLanguage();
        const i18n = strings[lang].ui.placeholders;

        const blur = await vscode.window.showInputBox({
            prompt: i18n.enterBlur,
            value: this.config.get('blur', 0).toString(),
            validateInput: (value: string) => {
                const num = parseInt(value);
                return (num >= 0 && num <= 100) ? null : strings[lang].notifications.blurError;
            }
        });

        if (blur) {
            const value = parseInt(blur);
            await this.config.update('blur', value, true);
            await this.applyCurrentTheme();
        }
    }

    private async configureUIElements() {
        const lang = this.getLanguage();
        const i18n = strings[lang].ui.uiElements;
        const config = vscode.workspace.getConfiguration('nezuTheme');

        // 現在の設定を取得
        const currentSettings = {
            editor: config.get('uiElements.editor', true),
            sidebar: config.get('uiElements.sidebar', true),
            activityBar: config.get('uiElements.activityBar', true),
            panel: config.get('uiElements.panel', true),
            statusBar: config.get('uiElements.statusBar', true),
            titleBar: config.get('uiElements.titleBar', true)
        };

        // QuickPickアイテムを作成
        const items: vscode.QuickPickItem[] = [
            {
                label: `${currentSettings.editor ? '$(check)' : '$(dash)'} ${i18n.editor}`,
                picked: currentSettings.editor,
                description: i18n.editorDesc
            },
            {
                label: `${currentSettings.sidebar ? '$(check)' : '$(dash)'} ${i18n.sidebar}`,
                picked: currentSettings.sidebar,
                description: i18n.sidebarDesc
            },
            {
                label: `${currentSettings.activityBar ? '$(check)' : '$(dash)'} ${i18n.activityBar}`,
                picked: currentSettings.activityBar,
                description: i18n.activityBarDesc
            },
            {
                label: `${currentSettings.panel ? '$(check)' : '$(dash)'} ${i18n.panel}`,
                picked: currentSettings.panel,
                description: i18n.panelDesc
            },
            {
                label: `${currentSettings.statusBar ? '$(check)' : '$(dash)'} ${i18n.statusBar}`,
                picked: currentSettings.statusBar,
                description: i18n.statusBarDesc
            },
            {
                label: `${currentSettings.titleBar ? '$(check)' : '$(dash)'} ${i18n.titleBar}`,
                picked: currentSettings.titleBar,
                description: i18n.titleBarDesc
            }
        ];

        // QuickPickを表示
        const selected = await vscode.window.showQuickPick(items, {
            canPickMany: true,
            placeHolder: strings[lang].ui.placeholders.selectUIElements
        });

        if (selected) {
            // 新しい設定を作成
            const newSettings = {
                editor: selected.some(item => item.label.includes(i18n.editor)),
                sidebar: selected.some(item => item.label.includes(i18n.sidebar)),
                activityBar: selected.some(item => item.label.includes(i18n.activityBar)),
                panel: selected.some(item => item.label.includes(i18n.panel)),
                statusBar: selected.some(item => item.label.includes(i18n.statusBar)),
                titleBar: selected.some(item => item.label.includes(i18n.titleBar))
            };

            // 設定を一括更新
            await Promise.all(
                Object.entries(newSettings).map(([key, value]) =>
                    config.update(`uiElements.${key}`, value, true)
                )
            );

            // 背景を再適用
            await this.applyCurrentTheme();
        }
    }

    public async applyCurrentTheme() {
        const imagePath = this.config.get<string>('imagePath');
        const opacity = this.config.get<number>('opacity', 0.2);
        const blur = this.config.get<number>('blur', 0);

        // 設定が未定義の場合は何もしない
        if (!imagePath || imagePath.trim() === '') {
            return;
        }

        try {
            // 背景を適用
            const success = await this.backgroundHelper.apply(imagePath, opacity, blur);
            if (success) {
                // 現在の言語を取得
                const currentLang = this.config.get('language', 'en') as 'en' | 'ja';
                const i18n = strings[currentLang].notifications;

                // 設定変更の確認を表示
                const selected = await vscode.window.showInformationMessage(
                    i18n.reloadPrompt,
                    i18n.reloadYes,
                    i18n.reloadNo
                );

                if (selected === i18n.reloadYes) {
                    // 設定を保存してから再起動
                    await vscode.workspace.saveAll();
                    await vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            }
        } catch (error) {
            await NotificationHelper.showError(error);
        }
    }
} 