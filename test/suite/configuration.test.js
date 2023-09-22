const { expect } = require("chai");

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require("vscode");
// const myExtension = require('../extension');

suite("Configuration Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests of configuration.");

  test("get default configuration value", () => {
    const settings = vscode.workspace.getConfiguration("make-wkdir");

    expect(settings.get("productsPath")).to.equal(
      "/Users/kanta/hacking/products"
    );
    expect(settings.get("toolsPath")).to.equal("/Users/kanta/hacking/tools");
    expect(settings.get("learningPath")).to.equal(
      "/Users/kanta/hacking/learning"
    );
    expect(settings.get("spikePath")).to.equal("/Users/kanta/hacking/spike");
  });
});
