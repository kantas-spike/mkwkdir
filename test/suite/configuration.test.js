const { expect } = require("chai");
const utils = require("../../utils")
const os = require('os')

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require("vscode");
// const myExtension = require('../extension');

suite("Configuration Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests of configuration.");

  test("get default configuration value", () => {
    const settings = vscode.workspace.getConfiguration("mkwkdir");

    expect(settings.get("productsPath")).to.equal(
      "${userHome}/hacking/products"
    );
    expect(utils.getBaseDirPath("productsPath")).to.equal(`${os.homedir()}/hacking/products`)

    expect(settings.get("toolsPath")).to.equal("${userHome}/hacking/tools");
    expect(utils.getBaseDirPath("toolsPath")).to.equal(`${os.homedir()}/hacking/tools`)

    expect(settings.get("learningPath")).to.equal(
      "${userHome}/hacking/learning"
    );
    expect(utils.getBaseDirPath("learningPath")).to.equal(`${os.homedir()}/hacking/learning`)

    expect(settings.get("spikePath")).to.equal("${userHome}/hacking/spike");
    expect(utils.getBaseDirPath("spikePath")).to.equal(`${os.homedir()}/hacking/spike`)

    expect(settings.get("resourcesPath")).to.equal("${userHome}/hacking/res");
    expect(utils.getBaseDirPath("resourcesPath")).to.equal(`${os.homedir()}/hacking/res`)
  });
});
