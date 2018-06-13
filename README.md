# Json Editor

A vscode extension to preview and edit JSON documents in a simple tree view, based on <https://jsoneditoronline.org>.

## Features

- Tree view updates automatically when you save the active document

    ![editor2tree](https://i.imgur.com/w0KI7QW.gif)

- Properties/values can edited in the tree view, which updates the active json document

    ![tree2editor](https://i.imgur.com/t7aPUTf.gif)

- Tree view supports searching, expand/collapse all, and undo/redo

    ![expandcollapsesearch](https://i.imgur.com/qa1hYbu.gif)

## Known Issues

1. Editing large json files (>1mb) from the tree view can sometimes cause edits to be lost or not fully synced.

## Contributions

- Tree view code provided by [jsoneditor](https://github.com/josdejong/jsoneditor)

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.4

- Make updating the editor from the tree a bit more consistent

### 0.0.3

- Fix borked icon

### 0.0.2

- Updated screenshots
- Fixed some spelling errors in the readme

### 0.0.1

Initial release of vscode-json-editor
