const path = require("path");
const fs = require("fs/promises");
const os = require("os")
const vscode = require("vscode");

const getMaxPrefixNo = async (dir) => {
  const absPath = path.resolve(dir);

  let stat;
  try {
    stat = await fs.lstat(dir);
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

const hasPrefix = (dirName) => {
  if (dirName.match(/\d+_.+/)) {
    return true
  } else {
    return false
  }
};

const formatDirName = (dirName, prefixNo) => {
  if (!dirName) {
    throw new Error(`invalid dirname: ${dirName}`)
  }
  return `${String(prefixNo).padStart(3, '0')}_${dirName}`
};

const makeWkDir = async (baseDir, wkDirName) => {
  const no = await getMaxPrefixNo(baseDir)
  const wkNameWithNo = formatDirName(wkDirName, no+1)
  const absPath = path.join(baseDir, wkNameWithNo)
  await fs.mkdir(absPath, { recursive: true})
  return absPath
};

const replaceVarUserHome = (path) => {
  return path.replace("${userHome}", os.homedir())
}

const getBaseDirPath = (baseDirKey) => {
  const baseDir = replaceVarUserHome(
    vscode.workspace.getConfiguration("mkwkdir").get(baseDirKey)
  );
  return baseDir;
}

module.exports = {
  getMaxPrefixNo,
  formatDirName,
  makeWkDir,
  hasPrefix,
  replaceVarUserHome,
  getBaseDirPath,
};
