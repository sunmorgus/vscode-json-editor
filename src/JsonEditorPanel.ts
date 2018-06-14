'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { configurationSettings } from './globals/enums';

export class JsonEditorPanel {
    public static currentPanel: JsonEditorPanel | undefined;

    private static readonly viewType: string = 'jsonEditor';
    private static readonly extensionPrefix: string = 'vscode-json-editor';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];
    private _currentEditor: vscode.TextEditor;

    private constructor(extensionPath: string, column: vscode.ViewColumn, theme: string) {
        this._extensionPath = extensionPath;
        this._currentEditor = vscode.window.activeTextEditor;
        this._panel = vscode.window.createWebviewPanel(JsonEditorPanel.viewType, "Json editor", column, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(this._extensionPath, 'jsoneditor'))
            ]
        });
        this._panel.webview.html = this.getHtmlForWebview(this._extensionPath, theme);

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(message => {
            if (this._currentEditor) {
                this._currentEditor.edit(editBuilder => {
                    const range: vscode.Range = new vscode.Range(
                        this._currentEditor.document.positionAt(0),
                        this._currentEditor.document.positionAt(this._currentEditor.document.getText().length)
                    );

                    editBuilder.replace(range, message.json);
                });
            }
        });

        vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        vscode.workspace.onDidSaveTextDocument(() => this.onDocumentChanged());

        this.onActiveEditorChanged();
    }

    // tslint:disable-next-line:function-name
    public static CreateOrShow(extensionPath: string): void {
        const column = vscode.ViewColumn.Three;
        const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(this.extensionPrefix);
        const theme: string = config.get(configurationSettings.theme);

        if (JsonEditorPanel.currentPanel) {
            JsonEditorPanel.currentPanel._panel.reveal(column);
        } else {
            JsonEditorPanel.currentPanel = new JsonEditorPanel(extensionPath, column, theme);
        }
    }

    public dispose(): void {
        JsonEditorPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private getJson(): string {
        let json: string = "";
        if (this._currentEditor) {
            json = this._currentEditor.document.getText();
        }
        return json;
    }

    private onActiveEditorChanged(): void {
        if (vscode.window.activeTextEditor) {
            this._currentEditor = vscode.window.activeTextEditor;
            const json: string = this.getJson();
            this._panel.webview.postMessage({ json: json });
        }
    }

    private onDocumentChanged(): void {
        const json: string = this.getJson();
        this._panel.webview.postMessage({ json: json });
    }

    private getHtmlForWebview(extensionPath: string, theme: string): string {
        const mainScriptPathOnDisk = vscode.Uri.file(path.join(extensionPath, 'jsoneditor', 'main.js'));
        const mainScriptUri = mainScriptPathOnDisk.with({ scheme: 'vscode-resource' });
        const scriptPathOnDisk = vscode.Uri.file(path.join(extensionPath, 'jsoneditor', 'jsoneditor.min.js'));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

        const cssPathOnDisk = vscode.Uri.file(path.join(extensionPath, 'jsoneditor', 'jsoneditor.min.css'));
        const cssUri = cssPathOnDisk.with({ scheme: 'vscode-resource' });

        const cssDarkPathOnDisk = vscode.Uri.file(path.join(extensionPath, 'jsoneditor', 'jsoneditor.dark.min.css'));
        const cssDarkUri = cssDarkPathOnDisk.with({ scheme: 'vscode-resource' });
        const darkTheme: string = theme === 'dark' ? `<link href="${cssDarkUri}" rel="stylesheet" type="text/css">` : '';

        return `
        <!DOCTYPE HTML>
        <html>
        <head>
            <!-- when using the mode "code", it's important to specify charset utf-8 -->
            <meta http-equiv="Content-Type" content="text/html;charset=utf-8">

            <link href="${cssUri}" rel="stylesheet" type="text/css">
            ${darkTheme}
            <script src="${scriptUri}"></script>
        </head>
        <body>
            <div id="jsoneditor"></div>

            <script src="${mainScriptUri}"></script>
        </body>
        </html>
        `;
    }
}
