const path = require("path");
const fs = require("fs/promises");
const os = require("os")
const vscode = require("vscode");

/**
 * カテゴリ別ディレクトリ配下のプレフィックス番号を持つディレクトリの内、最大のプレフィックス番号を取得する
 *
 * @param {string} catDir カテゴリ別ディレクトリパス
 * @returns 最大のプレフィックス番号
 */
const getMaxPrefixNo = async (catDir) => {
  const absPath = path.resolve(catDir);

  let stat;
  try {
    stat = await fs.lstat(catDir);
  } catch (error) {
    throw new Error(`dir not exists: ${absPath}`);
  }

  if (!stat.isDirectory()) {
    throw new Error(`${absPath} is not directory`);
  }

  let maxPrefixNo = 0;
  // サブディレクトリの一覧を取得
  const entries = await fs.readdir(absPath, { withFileTypes: true });
  // サブディレクトリ名からプレフィックス取得
  for (const entry of entries) {
    if (entry.isDirectory() && hasPrefix(entry.name)) {
      const prefixNo = Number(entry.name.match(/(\d+)_.+/)[1])
      if (prefixNo > maxPrefixNo) {
        maxPrefixNo = prefixNo
      }
    }
  }
  return maxPrefixNo;
};

/**
 * ディレクトリがプレフィックス番号を持つか判定する
 * @param {string} dirName
 * @returns プレフィックス番号を持つ場合 true, 持たない場合 false
 */
const hasPrefix = (dirName) => {
  if (dirName.match(/\d+_.+/)) {
    return true
  } else {
    return false
  }
};

/**
 * プレフィックス番号とディレクトリ名から作業フォルダー名を作成する
 *
 * @param {string} dirName ディレクトリ名
 * @param {number} prefixNo プレフィックス番号
 * @returns 作業フォルダー名
 */
const formatDirName = (dirName, prefixNo) => {
  if (!dirName) {
    throw new Error(`invalid dirname: ${dirName}`)
  }
  return `${String(prefixNo).padStart(3, '0')}_${dirName}`
};

/**
 * 作業ディレクトリを作成する
 *
 * @param {string} catDir カテゴリ別ディレクトリパス
 * @param {string} wkDirName 作業ディレクトリ名
 * @returns 作成された作業ディレクトリの絶対パス
 */
const makeWkDir = async (catDir, wkDirName) => {
  const no = await getMaxPrefixNo(catDir)
  const wkNameWithNo = formatDirName(wkDirName, no+1)
  const absPath = path.join(catDir, wkNameWithNo)
  await fs.mkdir(absPath, { recursive: true})
  return absPath
};

/**
 * 指定されたパス内に`${userHome}`があればホームディレクトリに変換する
 * @param {string} path パス
 * @returns `${userHome}`をホームディレクトリに変換したパス
 */
const replaceVarUserHome = (path) => {
  return path.replace("${userHome}", os.homedir())
}

/**
 * 設定情報からカテゴリ別ディレクトリパスを取得する
 *
 * @param {*} catDirKey カテゴリ別ディレクトリ取得用の設定名
 * @returns 指定されたカテゴリのディレクトリパス
 */
const getCategoryDirPath = (catDirKey) => {
  const catDir = replaceVarUserHome(
    vscode.workspace.getConfiguration("mkwkdir").get(catDirKey)
  );
  return catDir;
}

/**
 * `vscode.window.showInputBox`用のバリデーション処理
 * @param {string} input ユーザー入力値
 * @returns 不正な入力の場合メッセージを返却、正常な入力の場合`undefined`を返却
 */
const validateInputDirName = (input) => {
  if (input.includes(" ")) {
    return "名前に空白は使用できません";
  } else if (input.match(/[\\¥\/:*?"<>|]/g)) {
    return '名前に次の文字は使用できません: \\ ¥ / : * ? " < > |';
  } else {
    return undefined;
  }
}

module.exports = {
  getMaxPrefixNo,
  formatDirName,
  makeWkDir,
  hasPrefix,
  replaceVarUserHome,
  getCategoryDirPath,
  validateInputDirName,
};
