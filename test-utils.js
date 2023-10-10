const fs = require("fs");
const os = require("os");
const path = require("path");

let tmpDir;

const runTestInTempDir = async (fn, dirPrefix = "mkwkdir") => {
  try {
    try {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), dirPrefix));
    } catch (error) {
      console.error(`cannot create temp dir: `, error);
      throw error
    }
    await fn(tmpDir);
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

const pressShortcut = async (window, shortCutString, waitMsec=1000) => {
  await window.waitForTimeout(waitMsec);
  await window.keyboard.press(shortCutString);
}

const typeKeyboad = async (window, inputString, waitMsec=1000, delayMsec=100) => {
  await window.waitForTimeout(waitMsec);
  await window.keyboard.type(inputString, { delay: delayMsec });
}

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
