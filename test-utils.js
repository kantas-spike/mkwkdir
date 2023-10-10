const fs = require("fs");
const os = require("os");
const path = require("path");

let tmpDir;

/**
 * テスト用のテンプディレクトリを作成する
 *
 * @param {Function} testFn テスト用関数。引数としてテンプディレクトリのパスを受け取る
 * @param {string} dirPrefix テンプディレクトリに付与するプレフィックス
 */
const runTestInTempDir = async (testFn, dirPrefix = "mkwkdir") => {
  try {
    try {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), dirPrefix));
    } catch (error) {
      console.error(`cannot create temp dir: `, error);
      throw error
    }
    await testFn(tmpDir);
  } finally {
    try {
      if (tmpDir) {
        fs.rmSync(tmpDir, { recursive: true });
      }
    } catch (error) {
      console.error(`cannot remove temp dir(${tmpDir}): `, error);
    }
  }
};

/**
 * vscode操作用のショートカットキーを入力する
 *
 * @param {import("playwright").Page} window `playwrite`で取得したwindow
 * @param {string} shortCutString vscode操作用のショートカット文字列
 * @param {number} waitMsec 次の操作までの待ち時間(単位:ms)
 */
const pressShortcut = async (window, shortCutString, waitMsec=1000) => {
  await window.waitForTimeout(waitMsec);
  await window.keyboard.press(shortCutString);
}

/**
 * vscodeに文字列を入力する
 *
 * @param {import("playwright").Page} window `playwrite`で取得したwindow
 * @param {string} inputString vscodeに入力する文字列
 * @param {number} waitMsec 次の操作までの待ち時間(単位:ms)
 * @param {number} delayMsec キー入力ごとの待ち時間(単位:ms)。実際のユーザー入力のようにみせるための調整値
 */
const typeKeyboad = async (window, inputString, waitMsec=1000, delayMsec=100) => {
  await window.waitForTimeout(waitMsec);
  await window.keyboard.type(inputString, { delay: delayMsec });
}

/**
 * vscodeに表示されている通知メッセージを取得する
 *
 * @param {import("playwright").Page} window `playwrite`で取得したwindow
 * @param {number} waitMsec 次の操作までの待ち時間(単位:ms)
 * @returns 通知メッセージ一覧
 */
const getNotifications = async (window, waitMsec=5000) => {
  await window.waitForTimeout(waitMsec);
  return await window.locator(".notification-toast-container .monaco-list-row").all();
}

module.exports = {
  runTestInTempDir,
  pressShortcut,
  typeKeyboad,
  getNotifications,
};
