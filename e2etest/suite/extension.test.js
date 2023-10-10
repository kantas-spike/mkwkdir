const path = require("path");
const os = require("os");
const fs = require("fs");
const testUtils = require("../../test-utils");

const { downloadAndUnzipVSCode } = require("@vscode/test-electron");
const { _electron } = require("playwright");
const { expect } = require("chai");
const {
  prepareWkdirRoot,
  prepareWorkspace,
} = require("../../fixtures/fixture-utils");

const extensionDevelopmentPath = path.resolve(__dirname, "../..");

const args = [
  "--disable-gpu-sandbox", // https://github.com/microsoft/vscode-test/issues/221
  "--disable-updates", // https://github.com/microsoft/vscode-test/issues/120
  "--disable-workspace-trust",
  "--extensionDevelopmentPath=" + extensionDevelopmentPath,
  "--new-window", // Opens a new session of VS Code instead of restoring the previous session (default).
  "--no-sandbox", // https://github.com/microsoft/vscode/issues/84238
  "--profile-temp", // "debug in a clean environment"
  "--skip-release-notes",
  "--skip-welcome",
  "--user-data-dir",
  os.tmpdir(),
  path.join(extensionDevelopmentPath, "fixtures/workspace"), // folder
];

const FIXTURE_DIR = path.join(extensionDevelopmentPath, "fixtures");
const WKDIR_ROOT_DIR = path.join(FIXTURE_DIR, "wkdir_root");
const PATTERN_OF_WKDIR_ROOT_DIR = path.join(
  FIXTURE_DIR,
  "pattern_of_wkdir_root"
);

const WORKSPACE_DIR = path.join(FIXTURE_DIR, "workspace");

suite("E2E Test Suite", function () {
  let electronApp;
  let window;
  let vscodeExecutablePath
  suiteSetup("wkdir_rootとworkspaceを初期化", async function () {
    console.log(`    ${this.test.title}`);
    vscodeExecutablePath = await downloadAndUnzipVSCode();
    prepareWkdirRoot(
      WKDIR_ROOT_DIR,
      path.join(PATTERN_OF_WKDIR_ROOT_DIR, "empty")
    );
    prepareWorkspace(WORKSPACE_DIR, WKDIR_ROOT_DIR);
  });

  setup("vscodeをplaywriteで起動", async function () {
    // console.log(this.test.title);
    electronApp = await _electron.launch({
      executablePath: vscodeExecutablePath,
      args,
    });
    window = await electronApp.firstWindow();
    await window.waitForTimeout(5000);
  });

  teardown("起動したvscodeを終了", async function () {
    // console.log(this.test.title);
    electronApp.close();
    await window.waitForTimeout(5000);
  });

  test("起動確認", async () => {
    const title = await window.title();
    expect(title).to.match(/workspace/);
  });

  suite("for spike", async function () {
    test("`mkdir for spike`で`テスト`という作業ディレクトリを作成する", async () => {
      // check
      let wins = await electronApp.windows();
      expect(wins.length).to.equal(1);
      expect(fs.existsSync(path.join(FIXTURE_DIR, "wkdir_root/hacking/spike"))).to
        .false;

      // act
      //  コマンドパレットを開く
      await testUtils.pressShortcut(window, "Shift+Meta+P");
      //  `mkdir for spike`コマンドを実行
      await testUtils.typeKeyboad(window, "mkwkdir mkdir spike");
      await testUtils.pressShortcut(window, "Enter");
      //  `テスト`という作業ディレクトリを作成
      await testUtils.typeKeyboad(window, "テスト");
      await testUtils.pressShortcut(window, "Enter");

      // assert
      //  通知の確認
      const notifications = await testUtils.getNotifications(window);
      expect(notifications.length).to.equal(2);
      expect(await notifications[1].innerText()).to.equal(
        `${path.join(
          FIXTURE_DIR,
          "wkdir_root/hacking/spike"
        )}が存在しないため作成しました`
      );
      expect(await notifications[0].innerText()).to.equal(
        `作業ディレクトリを作成しました: ${path.join(
          FIXTURE_DIR,
          "wkdir_root/hacking/spike/001_テスト"
        )}`
      );
      // `テスト`作業ディレクトリの作成確認
      expect(fs.existsSync(path.join(FIXTURE_DIR, "wkdir_root/hacking/spike"))).to
        .true;
      expect(
        fs.existsSync(
          path.join(FIXTURE_DIR, "wkdir_root/hacking/spike/001_テスト")
        )
      ).to.true;

      // 新規ウィンドウが作成され、`テスト`ディレクトリが開かれていることを確認
      wins = await electronApp.windows();
      expect(wins.length).to.equal(2);
      expect(await wins[1].title()).to.match(/001_テスト/);
    });

    test("`open dir for spike`で`テスト`という作業ディレクトリを開く", async () => {
      // check
      let wins = await electronApp.windows();
      expect(wins.length).to.equal(1);
      expect(fs.existsSync(path.join(FIXTURE_DIR, "wkdir_root/hacking/spike"))).to
        .true;

      // act
      //   コマンドパレットを開く
      await testUtils.pressShortcut(window, "Shift+Meta+P");
      //   `open for spike`コマンドを実行
      await testUtils.typeKeyboad(window, "mkwkdir open spike");
      await testUtils.pressShortcut(window, "Enter");
      //   `テスト`ディレクトリを指定
      await testUtils.typeKeyboad(window, "テスト");
      await testUtils.pressShortcut(window, "Enter");

      // assert
      //   最新の通知の確認
      const notifications = await testUtils.getNotifications(window);
      expect(await notifications[0].innerText()).to.equal(
        `${path.join(
          FIXTURE_DIR,
          "wkdir_root/hacking/spike/001_テスト"
        )}を開きます...`
      );

      // 新規ウィンドウが作成され、`テスト`ディレクトリが開かれていることを確認
      wins = await electronApp.windows();
      expect(wins.length).to.equal(2);
      expect(await wins[1].title()).to.match(/001_テスト/);
    });

    suite("ディレクトリ名に不正な値が入力された場合", async function () {
      test("`mkdir for spike`にディレクトリ名が未指定の場合", async () => {
        // check
        let wins = await electronApp.windows();
        expect(wins.length).to.equal(1);

        // act
        //   コマンドパレットを開く
        await testUtils.pressShortcut(window, "Shift+Meta+P");
        //   `mkdir for spike`コマンドを実行
        await testUtils.typeKeyboad(window, "mkwkdir mkdir spike");
        await testUtils.pressShortcut(window, "Enter");
        //   作成するディレクトリ名を未指定にする
        await testUtils.pressShortcut(window, "Enter");

        // assert
        //   通知を確認
        const notifications = await testUtils.getNotifications(window);
        expect(await notifications[0].innerText()).to.equal("Spike用の作業ディレクトリ名を入力してください");

        //   新たなウィンドウは表示されない
        wins = await electronApp.windows();
        expect(wins.length).to.equal(1);
      });

      test("`mkdir for spike`に空白も持つディレクトリ名が指定された場合", async () => {
        // check
        let wins = await electronApp.windows();
        expect(wins.length).to.equal(1);

        // act
        await testUtils.pressShortcut(window, "Shift+Meta+P");
        await testUtils.typeKeyboad(window, "mkwkdir mkdir spike");
        await testUtils.pressShortcut(window, "Enter");
        await testUtils.typeKeyboad(window, "空白 あり");
        await testUtils.pressShortcut(window, "Enter");

        // assert
        //   エラーメッセージの確認
        const items = await window.getByText(/名前に空白は使用できません/).all()
        expect(items.length).to.equal(1)

        wins = await electronApp.windows();
        expect(wins.length).to.equal(1);
      });

      test("`mkdir for spike`に不正な文字を持つディレクトリ名が指定された場合", async () => {
        // check
        let wins = await electronApp.windows();
        expect(wins.length).to.equal(1);

        // act
        await testUtils.pressShortcut(window, "Shift+Meta+P");
        await testUtils.typeKeyboad(window, "mkwkdir mkdir spike");
        await testUtils.pressShortcut(window, "Enter");
        await testUtils.typeKeyboad(window, "不正文字/あり");
        await testUtils.pressShortcut(window, "Enter");

        // assert
        //   エラーメッセージの確認
        const items = await window.getByText(/名前に次の文字は使用できません:/).all()
        expect(items.length).to.equal(1)

        wins = await electronApp.windows();
        expect(wins.length).to.equal(1);
      });

      test("`open for dir`にディレクトリ名が未指定の場合", async () => {
        // check
        let wins = await electronApp.windows();
        expect(wins.length).to.equal(1);

        // act
        await testUtils.pressShortcut(window, "Shift+Meta+P");
        await testUtils.typeKeyboad(window, "mkwkdir open spike");
        await testUtils.pressShortcut(window, "Enter");
        //   ディレクトリ名を選択しない
        await testUtils.pressShortcut(window, "Escape");

        // assert
        //   通知を確認
        const notifications = await testUtils.getNotifications(window);
        expect(await notifications[0].innerText()).to.equal("Spike用の作業ディレクトリを選択してください");

        wins = await electronApp.windows();
        expect(wins.length).to.equal(1);
      });
    })
  })
});
