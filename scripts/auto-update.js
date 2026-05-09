#!/usr/bin/env node
// Daily silent auto-update for cami-design.
// Installs a launchd agent on macOS that runs `npm i -g cami-design@latest`
// once a day. No-op on Linux/Windows for now.
//
// Opt-out: set CAMI_DESIGN_NO_AUTO_UPDATE=1 in the install env.
// Manual disable: launchctl unload ~/Library/LaunchAgents/co.themobilefirst.cami-design.update.plist

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const LABEL = "co.themobilefirst.cami-design.update";
const plistPath = path.join(os.homedir(), "Library", "LaunchAgents", `${LABEL}.plist`);
const logOut = "/tmp/cami-design-update.log";
const logErr = "/tmp/cami-design-update.err.log";

function isMac() {
  return process.platform === "darwin";
}

function plistContents() {
  // Use a login shell so $PATH includes the user's npm prefix (nvm, asdf, brew, etc.)
  // StartInterval is in seconds. 86400 = 24h. launchd may coalesce to save power.
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTD/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>npm install -g cami-design@latest --silent</string>
  </array>
  <key>StartInterval</key>
  <integer>86400</integer>
  <key>RunAtLoad</key>
  <false/>
  <key>StandardOutPath</key>
  <string>${logOut}</string>
  <key>StandardErrorPath</key>
  <string>${logErr}</string>
</dict>
</plist>
`;
}

function install() {
  if (process.env.CAMI_DESIGN_NO_AUTO_UPDATE === "1") {
    console.log(`  ⏭  Auto-update skipped (CAMI_DESIGN_NO_AUTO_UPDATE=1)`);
    return;
  }
  if (!isMac()) {
    // Silently no-op on non-macOS for now.
    return;
  }

  try {
    fs.mkdirSync(path.dirname(plistPath), { recursive: true });

    // If a previous version is loaded, unload first so we can replace it cleanly.
    try {
      execSync(`launchctl unload "${plistPath}"`, { stdio: "ignore" });
    } catch {
      // Not loaded — fine.
    }

    fs.writeFileSync(plistPath, plistContents());

    try {
      execSync(`launchctl load "${plistPath}"`, { stdio: "ignore" });
      console.log(`  ↻  Daily auto-update enabled (launchd: ${LABEL})`);
    } catch (err) {
      console.log(`  ⚠  Auto-update plist written but launchctl load failed.`);
      console.log(`     Load manually: launchctl load "${plistPath}"`);
    }
  } catch (err) {
    // Never fail the install over auto-update setup.
    console.log(`  ⚠  Could not set up auto-update: ${err.message}`);
  }
}

function uninstall() {
  if (!isMac()) return;
  if (!fs.existsSync(plistPath)) return;

  try {
    execSync(`launchctl unload "${plistPath}"`, { stdio: "ignore" });
  } catch {
    // Not loaded — fine.
  }

  try {
    fs.unlinkSync(plistPath);
    console.log(`  ↻  Daily auto-update removed`);
  } catch (err) {
    console.log(`  ⚠  Could not remove auto-update plist: ${err.message}`);
  }
}

module.exports = { install, uninstall };

// Allow `node scripts/auto-update.js [install|uninstall]` for manual use.
if (require.main === module) {
  const cmd = process.argv[2] || "install";
  if (cmd === "uninstall") uninstall();
  else install();
}
