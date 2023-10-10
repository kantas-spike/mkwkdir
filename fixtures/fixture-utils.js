const fs = require("fs");
const path = require("path")

function prepareWkdirRoot(wkRoot, dirPathToCopy) {
  if (fs.existsSync(wkRoot)) {
    console.log(`      ${wkRoot}を削除...`);
    fs.rmSync(wkRoot, { recursive: true, force: true });
  }
  console.log(`      ${dirPathToCopy}を${wkRoot}としてcopy...`);
  fs.cpSync(dirPathToCopy, wkRoot, { recursive: true });
}

function prepareWorkspace(workspaceDir, wkRoot) {
  const settingsPath = path.join(workspaceDir, ".vscode/settings.json")
  if (fs.existsSync(settingsPath)) {
    console.log(`      ${settingsPath}を削除...`)
    fs.rmSync(settingsPath)
  }
  console.log(`      ${settingsPath}を生成...`)
  const settings = getSettings(wkRoot)
  fs.writeFileSync(settingsPath, JSON.stringify(settings))
}

function getSettings(wkRoot) {
  return {
    "mkwkdir.learningPath": `${wkRoot}/hacking/learning`,
    "mkwkdir.productsPath": `${wkRoot}/hacking/products`,
    "mkwkdir.resourcesPath": `${wkRoot}/hacking/res`,
    "mkwkdir.spikePath": `${wkRoot}/hacking/spike`,
    "mkwkdir.toolsPath": `${wkRoot}/hacking/tools`,
  }
}

module.exports = {
  prepareWkdirRoot,
  prepareWorkspace,
}
