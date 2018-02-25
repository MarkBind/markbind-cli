// Mock specific functions of fs-extra-promise module
const path = require('path');
const { fs, vol } = require('memfs');

/**
 * Mocking fs-extra-promise#readJsonAsync
 * TODO: Error throwing
 */
fs.readJsonAsync = filePath => Promise.resolve(JSON.parse(fs.readFileSync(filePath, 'utf8')));

/**
 * Remove directory recursively
 * @param {string} dirPath
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((entry) => {
      const entryPath = path.join(dirPath, entry);
      if (fs.lstatSync(entryPath).isDirectory()) {
        rimraf(entryPath);
      } else {
        fs.unlinkSync(entryPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

/**
 * Iterativelts creates directories to the file or directory
 * @param pathArg
 */
function createDir(pathArg) {
  const { dir, ext } = path.parse(pathArg);
  const dirNames = (ext === '')
    ? pathArg.split(path.sep)
    : dir.split(pathArg.sep);

  dirNames.reduce((accumDir, currentdir) => {
    const jointDir = path.join(accumDir, currentdir);
    if (!fs.existsSync(jointDir)) {
      fs.mkdirSync(jointDir);
    }
    return jointDir;
  }, '');
}

/**
 * fs#copyFileSync not implemented in memfs
 * this does not accurately mock fs#copyFileSync behaviour as it should not accept directories
 * @see https://stackoverflow.com/a/26038979
 */
function copyFileSync(src, dest) {
  if (!fs.lstatSync(src).isFile()) {
    throw new Error(`copyFileSync expected file but got: ${src}`);
  }
  fs.writeFileSync(dest, fs.readFileSync(src));
}


function copyDirSync(src, dest) {
  if (fs.lstatSync(src).isDirectory()) {
    const files = fs.readdirSync(src);
    files.forEach((file) => {
      const curSource = path.join(src, file);
      const curDest = path.join(dest, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        if (!fs.existsSync(curDest)) {
          createDir(curDest);
        }
        copyDirSync(curSource, curDest);
      } else {
        copyFileSync(curSource, curDest);
      }
    });
  }
}

fs.outputFileSync = (file, data) => {
  createDir(file);
  fs.writeFileSync(file, data);
};

/**
 * Mocking fs-extra#emptydirSync
 */
fs.emptydirSync = (dir) => {
  if (!fs.existsSync(dir)) {
    createDir(dir);
  } else {
    rimraf(dir);
  }
};

/**
 * Mocking fs-extra-promise#removeAsync
 */

fs.removeAsync = pathArg => new Promise((resolve, reject) => {
  try {
    if (fs.lstatSync(pathArg).isDirectory()) {
      rimraf(pathArg);
    } else {
      fs.unlinkSync(pathArg);
    }
    resolve();
  } catch (err) {
    reject(err);
  }
});

/**
 * Mocking fs-extra-promise#copyAsync
 */
fs.copyAsync = (src, dest) => new Promise((resolve, reject) => {
  try {
    fs.copySync(src, dest);
    resolve();
  } catch (err) {
    reject(err);
  }
});

/**
 * Mocking fs-extra#copySync
 */
fs.copySync = (src, dest) => {
  if (fs.lstatSync(src).isDirectory()) {
    copyDirSync(src, dest);
  } else {
    copyFileSync(src, dest);
  }
};

fs.vol = vol;
module.exports = fs;
