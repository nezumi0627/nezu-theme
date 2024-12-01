# Nezu Theme - VS Code Background Extension

[English](./README_EN.md) | [日本語](./README.md)

A VS Code extension that allows you to set custom background images with various effects.

## Features

- Custom background image support
- Adjustable opacity and blur effects
- Configurable UI element visibility
- English/Japanese language support
- Automatic background update feature

## Usage

1. Open Command Palette (Ctrl+Shift+P) and run "Nezu Theme - Configure"
2. Select from options:
   - Choose background image
   - Select image directory (for random switching)
   - Set opacity (0-0.8)
   - Set blur effect (0-100)
   - Configure UI elements
   - Enable/disable auto update

## Settings

- `nezuTheme.opacity`: Background opacity (0-0.8)
- `nezuTheme.blur`: Background blur effect (0-100)
- `nezuTheme.imagePath`: Background image path
- `nezuTheme.autoStatus`: Auto update on startup
- `nezuTheme.language`: Display language (en/ja)
- `nezuTheme.uiElements`: UI element visibility
  - editor: Editor background
  - sidebar: Sidebar background
  - activityBar: Activity bar background
  - panel: Panel background
  - statusBar: Status bar background
  - titleBar: Title bar background

## Keyboard Shortcuts

- `Ctrl+Shift+F7`: Random background switch (when directory is set)

## Notes

- Settings may reset after VS Code updates as this modifies internal files
- VS Code restart required after changing settings
- Backup files (.bak) are created automatically

## License

MIT License 