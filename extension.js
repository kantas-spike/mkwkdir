// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const utils = require("./utils");
const child_process = require("child_process");
const fs = require("fs/promises");

function makeWkDir(name, baseDirKey) {
  return async () => {
    try {
      const dirName = await vscode.window.showInputBox({
        title: `${name}用の作業ディレクトリ名入力:`,
        validateInput: (input) => {
          if (input.includes(" ")) {
            return "名前に空白は使用できません";
          } else if (input.match(/[\\¥\/:*?"<>|]/g)) {
            return '名前に次の文字は使用できません: \\ ¥ / : * ? " < > |';
          } else {
            return null;
          }
        },
      });

      if (!dirName) {
        vscode.window.showErrorMessage("作業ディレクトリ名を選択してください");
        return;
      }

      const baseDir = utils.getBaseDirPath(baseDirKey);
      try {
        await fs.stat(baseDir);
      } catch (error) {
        vscode.window.showInformationMessage(
          `${baseDir}が存在しないため作成しました`
        );
        await fs.mkdir(baseDir, { recursive: true });
      }

      const wkDirPath = await utils.makeWkDir(baseDir, dirName);
      vscode.window.showInformationMessage(
        `作業ディレクトリを作成しました: ${wkDirPath}`
      );
      child_process.spawn(`code "${wkDirPath}"`, {
        shell: true,
        detached: true,
      });
    } catch (err) {
      vscode.window.showErrorMessage(
        `予期しないエラーが発生しました。: ${err.message}`
      );
    }
  };
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "mkwkdir" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.makeWkDirForProducts",
      makeWkDir("Products", "productsPath")
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.makeWkDirForTools",
      makeWkDir("Tools", "toolsPath")
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.makeWkDirForLearning",
      makeWkDir("Tools", "learningPath")
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.makeWkDirForSpike",
      makeWkDir("Tools", "spikePath")
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.makeWkDirForResources",
      makeWkDir("Tools", "resourcesPath")
    )
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
