const vscode = acquireVsCodeApi();
var updateEditorTimeout = undefined;

// create the editor
var container = document.getElementById("jsoneditor");
container.style.height = window.innerHeight + "px";
var options = {
    onError: function (err) {
        alert(err.toString());
    },
    onChange: function () {
        if (updateEditorTimeout) {
            clearTimeout(updateEditorTimeout);
        }

        var json = JSON.stringify(editor.get(), null, 2);
        updateEditorTimeout = setTimeout(() => {
            vscode.postMessage({
                json: json
            });
        }, 500);
    }
};
const editor = new JSONEditor(container, options);

window.addEventListener('message', event => {
    const message = event.data; // The JSON data our extension sent
    editor.set(JSON.parse(message.json));
});
