const fs = require("fs");
const path = require("path");

// Build folder
const buildDir = path.join(__dirname, "build");

// Create .well-known folder inside build
const wellKnownDir = path.join(buildDir, ".well-known");
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir);
}

// Copy manifest
fs.copyFileSync(
  path.join(__dirname, "public", "farcaster.json"),
  path.join(wellKnownDir, "farcaster.json")
);

console.log(".well-known/farcaster.json created in build folder");
