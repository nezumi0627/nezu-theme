# Nezu Theme - VS Code Background Extension

[English](./README_EN.md) | [日本語](./README.md)

A VS Code extension that allows you to set custom background images.

## How it Works

This extension implements background images in VS Code through the following methods:

1. **Background Image Application Process**:
   - Modifies VS Code's internal file (workbench.desktop.main.js)
   - Injects CSS and JavaScript for background image settings
   - Creates backup of original file (.bak)

2. **Main Components**:
   - `BackgroundHelper`: Handles file operations and style injection
   - `ThemeManager`: Manages settings and UI controls
   - `ThemeStyles`: Generates CSS styles

3. **Styling Mechanism**:
   ```css
   /* Background image settings */
   .monaco-workbench::before {
       content: '';
       position: fixed;
       width: 100vw;
       height: 100vh;
       background-image: url('...');
       /* Other styles */
   }
   ```

4. **Opacity Control**:
   - Editor: rgba(30, 30, 30, 0.6)
   - Sidebar: rgba(30, 30, 30, 0.7)
   - Other UI elements: Appropriate opacity settings

5. **Configurable Options**:
   - Background image path
   - Opacity (0-0.8)
   - Blur effect (0-100)
   - UI element visibility
   - Display language (English/Japanese)

## Usage

1. Open Command Palette (Ctrl+Shift+P) and run "Nezu Theme - Configure"
2. Select from options:
   - Choose background image
   - Set opacity
   - Set blur effect
   - Configure UI elements

## Notes

- Settings may reset after VS Code updates as this modifies internal files
- VS Code restart required after changing settings
- Backup files (.bak) are created automatically

## Technical Details

1. **File Structure**:
   ```
   nezu-theme/
   ├── src/
   │   ├── backgroundHelper.ts  // File operations
   │   ├── themeManager.ts     // Settings management
   │   └── styles/
   │       └── themeStyles.ts  // Style generation
   ```

2. **Background Image Application Flow**:
   1. Path normalization
   2. CSS style generation
   3. Style injection into JS file
   4. VS Code restart to apply changes

3. **Error Handling**:
   - Automatic file permission acquisition
   - Backup file creation
   - Error notification display

## License

MIT License 