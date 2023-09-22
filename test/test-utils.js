const fs = require("fs");
const os = require("os");
const path = require("path");

let tmpDir;

const runTestInTempDir = async (fn, dirPrefix = "make-wkdir") => {
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

module.exports = {
  runTestInTempDir,
};
