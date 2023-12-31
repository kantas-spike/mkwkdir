// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const utils = require("./utils");
const fs = require("fs/promises");
const path = require("path");

/**
 * 収集するか判定する
 *
 * @param {string} baseDir
 * @param {fs.Dirent} entry
 * @param {Array} ignoreList
 * @returns true: 収集する, false: 収集しない
 */
async function isTargetEntry(baseDir, entry, ignoreList = [".DS_Store"]) {
  if (ignoreList.includes(entry.name)) {
    return false;
  }
  if (entry.isDirectory()) {
    return true;
  } else if (entry.isSymbolicLink()) {
    const symPath = path.join(baseDir, entry.name);
    const realPath = await fs.readlink(symPath);
    const ent = await fs.stat(realPath);
    if (ent.isDirectory()) {
      return true;
    }
  }

  return false;
}

/**
 * `mkwkdir.selectWkDirFor${カテゴリ名}`コマンドに登録する関数を生成する
 *
 * @param {string} name 作業ディレクトリのカテゴリ名
 * @param {string} baseDirKey 作業ディレクトリの名前. 作業ディレクトリのルートディレクトリ直下に配置されるディレクトリ名
 * @returns `vscode.commands`への登録用の関数を返却する
 */
function selectWkDir(name, baseDirKey) {
  return async () => {
    const baseDir = utils.getCategoryDirPath(baseDirKey);
    try {
      await fs.stat(baseDir);
    } catch (error) {
      vscode.window.showInformationMessage(
        `${baseDir}が存在しないため作成しました`,
      );
      await fs.mkdir(baseDir, { recursive: true });
    }
    const subdirs = [];
    const entryList = await fs.readdir(baseDir, { withFileTypes: true });
    for (const entry of entryList) {
      if (await isTargetEntry(baseDir, entry)) {
        subdirs.push(path.join(baseDir, entry.name));
      }
    }
    const selectedDir = await vscode.window.showQuickPick(subdirs, {
      canPickMany: false,
      title: `${name} 作業ディレクトリの選択`,
    });

    if (selectedDir) {
      vscode.window.showInformationMessage(`${selectedDir}を開きます...`);
      await vscode.commands.executeCommand(
        "vscode.openFolder",
        vscode.Uri.file(selectedDir),
        { forceNewWindow: true },
      );
    } else {
      vscode.window.showErrorMessage(
        `${name}用の作業ディレクトリを選択してください`,
      );
    }
  };
}

/**
 * `mkwkdir.makeWkDirFor${カテゴリ名}`コマンドに登録する関数を生成する
 *
 * @param {string} name 作業ディレクトリのカテゴリ名
 * @param {string} baseDirKey 作業ディレクトリの名前. 作業ディレクトリのルートディレクトリ直下に配置されるディレクトリ名
 * @returns `vscode.commands`への登録用の関数を返却する
 */
function makeWkDir(name, baseDirKey) {
  return async () => {
    try {
      const inputtedDirName = await vscode.window.showInputBox({
        title: `${name}用の作業ディレクトリ名入力:`,
        validateInput: utils.validateInputDirName,
      });

      if (!inputtedDirName) {
        vscode.window.showErrorMessage(
          `${name}用の作業ディレクトリ名を入力してください`,
        );
        return;
      }

      const baseDir = utils.getCategoryDirPath(baseDirKey);
      try {
        await fs.stat(baseDir);
      } catch (error) {
        vscode.window.showInformationMessage(
          `${baseDir}が存在しないため作成しました`,
        );
        await fs.mkdir(baseDir, { recursive: true });
      }

      const wkDirPath = await utils.makeWkDir(baseDir, inputtedDirName);
      vscode.window.showInformationMessage(
        `作業ディレクトリを作成しました: ${wkDirPath}`,
      );
      await vscode.commands.executeCommand(
        "vscode.openFolder",
        vscode.Uri.file(wkDirPath),
        { forceNewWindow: true },
      );
    } catch (err) {
      vscode.window.showErrorMessage(
        `予期しないエラーが発生しました。: ${err.message}`,
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
      makeWkDir("Products", "productsPath"),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.makeWkDirForTools",
      makeWkDir("Tools", "toolsPath"),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.makeWkDirForLearning",
      makeWkDir("Learning", "learningPath"),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.makeWkDirForSpike",
      makeWkDir("Spike", "spikePath"),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.makeWkDirForResources",
      makeWkDir("Resources", "resourcesPath"),
    ),
  );
  // selectWkDir系
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.selectWkDirForProducts",
      selectWkDir("Products", "productsPath"),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.selectWkDirForTools",
      selectWkDir("Tools", "toolsPath"),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.selectWkDirForLearning",
      selectWkDir("Learning", "learningPath"),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.selectWkDirForSpike",
      selectWkDir("Spike", "spikePath"),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mkwkdir.selectWkDirForResources",
      selectWkDir("Resources", "resourcesPath"),
    ),
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
