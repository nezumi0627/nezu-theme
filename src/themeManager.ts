import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import { BackgroundHelper } from './backgroundHelper';

export class ThemeManager {
    private config = vscode.workspace.getConfiguration('nezuTheme');
    private backgroundHelper: BackgroundHelper;

    constructor() {
        this.backgroundHelper = new BackgroundHelper();
    }

    public async showThemeOptions() {
        const options: vscode.QuickPickItem[] = [
            {
                label: "$(file-media) Select Background Image",
                description: "Choose a background image"
            },
            {
                label: "$(folder) Select Image Directory",
                description: "Choose a directory with images"
            },
            {
                label: "$(settings) Configure Opacity",
                description: "Set background opacity (0-0.8)"
            },
            {
                label: "$(settings) Configure Blur",
                description: "Set background blur (0-100)"
            }
        ];

        if (this.config.get('autoStatus')) {
            options.push({
                label: "$(sync) Disable Auto Update",
                description: "Disable automatic background update on startup"
            });
        } else {
            options.push({
                label: "$(sync) Enable Auto Update",
                description: "Enable automatic background update on startup"
            });
        }

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: "Select theme option"
        });

        if (selected) {
            switch (selected.label) {
                case "$(file-media) Select Background Image":
                    await this.selectBackgroundImage();
                    break;
                case "$(folder) Select Image Directory":
                    await this.selectImageDirectory();
                    break;
                case "$(settings) Configure Opacity":
                    await this.configureOpacity();
                    break;
                case "$(settings) Configure Blur":
                    await this.configureBlur();
                    break;
                case "$(sync) Enable Auto Update":
                    await this.config.update('autoStatus', true, true);
                    break;
                case "$(sync) Disable Auto Update":
                    await this.config.update('autoStatus', false, true);
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
        const opacity = await vscode.window.showInputBox({
            prompt: "Enter opacity value (0-0.8)",
            value: this.config.get('opacity', 0.2).toString()
        });

        if (opacity) {
            const value = parseFloat(opacity);
            if (value >= 0 && value <= 0.8) {
                await this.config.update('opacity', value, true);
                await this.applyCurrentTheme();
            } else {
                vscode.window.showErrorMessage('Opacity must be between 0 and 0.8');
            }
        }
    }

    private async configureBlur() {
        const blur = await vscode.window.showInputBox({
            prompt: "Enter blur value (0-100)",
            value: this.config.get('blur', 0).toString()
        });

        if (blur) {
            const value = parseInt(blur);
            if (value >= 0 && value <= 100) {
                await this.config.update('blur', value, true);
                await this.applyCurrentTheme();
            } else {
                vscode.window.showErrorMessage('Blur must be between 0 and 100');
            }
        }
    }

    public async applyCurrentTheme() {
        const imagePath = this.config.get<string>('imagePath');
        const opacity = this.config.get<number>('opacity', 0.2);
        const blur = this.config.get<number>('blur', 0);

        if (!imagePath) {
            await this.backgroundHelper.remove();
            return;
        }

        try {
            const success = await this.backgroundHelper.apply(imagePath, opacity, blur);
            if (success) {
                const result = await vscode.window.showInformationMessage(
                    'Background updated. Reload window to apply changes?',
                    'Yes',
                    'No'
                );
                if (result === 'Yes') {
                    await vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to apply theme: ${error}`);
        }
    }
} 