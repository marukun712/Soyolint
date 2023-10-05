const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

//なんで画像表示したの!
function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            <img src="https://github.com/marukun712/Soyolint/raw/master/images/soyo.png"/>
        </body>
    </html>`;
}

function activate(context) {
    //active
    console.log('Congratulations, your extension "Soyolint" is now active!');

    //コマンド本体
    let disposable = vscode.commands.registerCommand('soyolint.check', function () {
        //すべての診断を取得
        const allDiagnostics = vscode.languages.getDiagnostics();
        //mapで診断を取得
        allDiagnostics.map((diagnostic) => {
            diagnostic[1].map((error) => {
                //診断のsourceがeslintであればキレる
                if (error.source == "eslint") {
                    //キレる
                    createMessage(error.message)
                }
            })
        })
    });

    //コマンドを登録
    context.subscriptions.push(disposable);

    //セーブ時に自動チェック
    vscode.workspace.onDidSaveTextDocument(() => {
        //設定の値を取得
        const config = vscode.workspace.getConfiguration('soyolint');
        const isAutoCheck = config.get('autosave');

        //soyolint.autosaveが有効であれば自動チェック
        if (isAutoCheck) {
            vscode.commands.executeCommand("soyolint.check")
        }
    });
}

//キレる
function createMessage(message) {
    //画像表示
    const panel = vscode.window.createWebviewPanel(
        "soyo",
        `soyo`,
        vscode.ViewColumn.Beside,
        {}
    );
    panel.webview.html = getWebviewContent();

    //メッセージ表示
    vscode.window.showInformationMessage(`なんで${message}やったの!`, {
        modal: true,
    });
}

module.exports = {
    activate,
}
