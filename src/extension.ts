'use strict';
import * as vscode from 'vscode';
import { JsonEditorPanel } from './JsonEditorPanel';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// tslint:disable-next-line:export-name
export function activate(context: vscode.ExtensionContext): void {

    const startCommand = vscode.commands.registerCommand('vscode-json-editor.start', () => {
        JsonEditorPanel.CreateOrShow(context.extensionPath);
    });

    context.subscriptions.push(startCommand);
}
