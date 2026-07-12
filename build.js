const fs = require("fs");
const path = require("path");

const root = __dirname;
const out = path.join(root, "public");

const include = [
  "admin",
  "assets",
  "content",
  "en",
  "pt",
  "index.html",
  "favicon.ico",
  "favicon.svg",
  "apple-touch-icon.png"
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

for (const item of include) {
  const srcPath = path.join(root, item);
  const destPath = path.join(out, item);
  if (fs.existsSync(srcPath)) {
    copyRecursive(srcPath, destPath);
  }
}

console.log("Static site copied to /public");
