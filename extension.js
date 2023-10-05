// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const utils = require("./utils");
const child_process = require("child_process");
const fs = require("fs/promises");
const path = require("path");

function selectWkDir(name, baseDirKey) {
  return async () => {
    const baseDir = utils.getBaseDirPath(baseDirKey);
    const subdirs = (await fs.readdir(baseDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(baseDir, entry.name));
    const selectedDir = await vscode.window.showQuickPick(subdirs, {
      canPickMany: false,
      title: `${name} 作業ディレクトリの選択`,
    });

    if (selectedDir) {
      vscode.window.showInformationMessage(`${selectedDir}を開きます...`);
      await vscode.commands.executeCommand(
        "vscode.openFolder",
        vscode.Uri.file(selectedDir),
        { forceNewWindow: true }
      );
    } else {
      vscode.window.showErrorMessage(
        `${name}用の作業ディレクトリを選択してください`
      );
    }
  };
}

function makeWkDir(name, baseDirKey) {
  return async (dirName) => {
    try {
      let inputtedDirName = dirName;
      if (!inputtedDirName) {
        inputtedDirName = await vscode.window.showInputBox({
          title: `${name}用の作業ディレクトリ名入力:`,
          validateInput: utils.validateInputDirName,
        });

        if (!inputtedDirName) {
          vscode.window.showErrorMessage(
            "作業ディレクトリ名を選択してください"
          );
          return;
        }
      } else {
        const msg = utils.validateInputDirName(inputtedDirName)
        if (msg) {
          vscode.window.showErrorMessage(
            `ディレクトリ名が不正です: ${msg}`
          );
        }
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

      const wkDirPath = await utils.makeWkDir(baseDir, inputtedDirName);
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

  // makeWkDir系
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
  // selectWkDir系
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.selectWkDirForProducts",
      selectWkDir("Products", "productsPath")
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.selectWkDirForTools",
      selectWkDir("Tools", "toolsPath")
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.selectWkDirForLearning",
      selectWkDir("Tools", "learningPath")
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.selectWkDirForSpike",
      selectWkDir("Tools", "spikePath")
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.selectWkDirForResources",
      selectWkDir("Tools", "resourcesPath")
    )
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
