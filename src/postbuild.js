const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "build");
const src = path.join(buildDir, "well-known");
const dest = path.join(buildDir, ".well-known");

fs.rename(src, dest, (err) => {
  if (err) console.error("Rename error:", err);
  else console.log("Renamed well-known to .well-known");
});
