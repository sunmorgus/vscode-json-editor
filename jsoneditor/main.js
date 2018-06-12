const vscode = acquireVsCodeApi();

// create the editor
var container = document.getElementById("jsoneditor");
container.style.height = window.innerHeight + "px";
var options = {
    onError: function (err) {
        alert(err.toString());
    },
    onChange: function () {
        console.log("changed: ");
        var json = JSON.stringify(editor.get(), null, 2);
        setTimeout(() => {
            vscode.postMessage({
                json: json
            });
        }, 100);
    }
};
const editor = new JSONEditor(container, options);

window.addEventListener('message', event => {
    const message = event.data; // The JSON data our extension sent
    editor.set(JSON.parse(message.json));
});
