const fs = require('fs');

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function rmrf(target) {
  try {
    await fs.promises.rm(target, { recursive: true, force: true });
  } catch {}
}

module.exports = { ensureDir, rmrf };
