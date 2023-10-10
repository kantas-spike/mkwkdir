const { expect } = require("chai");
const utils = require("../../utils")
const path = require('path')

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require("vscode");
const { prepareWorkspace } = require("../../fixtures/fixture-utils");
// const myExtension = require('../extension');

const FIXTURE_DIR = path.join(__dirname, "../../fixtures");
const WKDIR_ROOT_DIR = path.join(FIXTURE_DIR, "wkdir_root");
const WORKSPACE_DIR = path.join(FIXTURE_DIR, "workspace")

suite("Configuration Test Suite", () => {
  // vscode.window.showInformationMessage("Start all tests of configuration.");
  suiteSetup("workspaceを初期化", () => {
    prepareWorkspace(WORKSPACE_DIR, WKDIR_ROOT_DIR)
  })

  test("get workspace's configuration value", () => {
    const settings = vscode.workspace.getConfiguration("mkwkdir");

    expect(settings.get("productsPath")).to.equal(
      `${WKDIR_ROOT_DIR}/hacking/products`
    );
    expect(utils.getCategoryDirPath("productsPath")).to.equal(`${WKDIR_ROOT_DIR}/hacking/products`)

    expect(settings.get("toolsPath")).to.equal(`${WKDIR_ROOT_DIR}/hacking/tools`);
    expect(utils.getCategoryDirPath("toolsPath")).to.equal(`${WKDIR_ROOT_DIR}/hacking/tools`)

    expect(settings.get("learningPath")).to.equal(
      `${WKDIR_ROOT_DIR}/hacking/learning`
    );
    expect(utils.getCategoryDirPath("learningPath")).to.equal(`${WKDIR_ROOT_DIR}/hacking/learning`)

    expect(settings.get("spikePath")).to.equal(`${WKDIR_ROOT_DIR}/hacking/spike`);
    expect(utils.getCategoryDirPath("spikePath")).to.equal(`${WKDIR_ROOT_DIR}/hacking/spike`)

    expect(settings.get("resourcesPath")).to.equal(`${WKDIR_ROOT_DIR}/hacking/res`);
    expect(utils.getCategoryDirPath("resourcesPath")).to.equal(`${WKDIR_ROOT_DIR}/hacking/res`)
  });
});
