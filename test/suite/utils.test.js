const { expect } = require("chai");

const fs = require("fs");
const path = require("path");

const utils = require("../../utils");

const { runTestInTempDir } = require("../test-utils");

suite("utils.hasPrefix Test Suite", () => {
  test("bad dirname", () => {
    expect(utils.hasPrefix("aaaa")).to.equal(false);
    expect(utils.hasPrefix("001aaaa")).to.equal(false);
    expect(utils.hasPrefix("001_")).to.equal(false);
  });
  test("good dirname", () => {
    expect(utils.hasPrefix("001_aaaa")).to.equal(true);
    expect(utils.hasPrefix("000_a")).to.equal(true);
  });
});

suite("utils.formatDirName", () => {
  test("falsy dirname", () => {
    expect(() => utils.formatDirName("", 1)).to.throw(/invalid dirname/);
  });

  test("format dirname", () => {
    expect(utils.formatDirName("aaa", 1)).to.equal("001_aaa");
  });
});

suite("utils.getMaxPrefixNo Test Suite", () => {
  test("dosen't exists dir", async () => {
    try {
      await utils.getMaxPrefixNo("/notexistsDirPath");
    } catch (error) {
      expect(error).to.match(/not exists/);
    }
  });

  test("is not dir", async () => {
    await runTestInTempDir(async (tmpdir) => {
      const wkFile = path.join(tmpdir, "test.txt");
      fs.writeFileSync(wkFile, "test");
      // console.log(wkFile, fs.existsSync(wkFile));
      try {
        await utils.getMaxPrefixNo(wkFile);
      } catch (error) {
        expect(error).to.match(/not directory/);
      }
    });
  });

  test("empty dir", async () => {
    await runTestInTempDir(async (tmpdir) => {
      // console.log(tmpdir, fs.existsSync(tmpdir));
      const no = await utils.getMaxPrefixNo(tmpdir);
      expect(no).to.equal(0);
    });
  });

  test("dir with subdirs", async () => {
    await runTestInTempDir(async (tmpdir) => {
      // console.log(tmpdir, fs.existsSync(tmpdir));
      const sub_dirs = ["001_aaa", "005_bbb", "009_ccc"];
      for (const subdir of sub_dirs) {
        fs.mkdirSync(path.join(tmpdir, subdir));
      }
      const no = await utils.getMaxPrefixNo(tmpdir);
      expect(no).to.equal(9);
    });
  });
});

suite("utils.makeWkDir", async () => {
  test("make work dir", async () => {
    await runTestInTempDir(async (tmpdir) => {
      let no = await utils.getMaxPrefixNo(tmpdir)
      expect(no).to.equal(0)
      expect(fs.existsSync(path.join(tmpdir, "001_aaa"))).to.equal(false)
      let ret_path = await utils.makeWkDir(tmpdir, "aaa")
      expect(fs.existsSync(path.join(tmpdir, "001_aaa"))).to.equal(true)
      expect(ret_path).to.equal(path.join(tmpdir, "001_aaa"))

      no = await utils.getMaxPrefixNo(tmpdir)
      expect(no).to.equal(1)
      expect(fs.existsSync(path.join(tmpdir, "002_bbb"))).to.equal(false)
      ret_path = await utils.makeWkDir(tmpdir, "bbb")
      expect(fs.existsSync(path.join(tmpdir, "002_bbb"))).to.equal(true)
      expect(ret_path).to.equal(path.join(tmpdir, "002_bbb"))

      no = await utils.getMaxPrefixNo(tmpdir)
      expect(no).to.equal(2)
    })
  })
})
