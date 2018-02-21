// Mock specific functions of fs-extra-promise module
const path = require('path');
const { fs, vol } = require('memfs');

// fs.mockFileSystem;

// /**
//  * Mocking fs#readFileSync:
//  * https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
//  * @param filepath
//  * @param options
//  * @returns {string}
//  */
//
//
// fs.readFileSync = fs.readFileSync;
//
//
// /**
//  * Mocking fs-extra#emptydirSync
//  *
//  * @param filePath
//  */
// fs.emptydirSync = (filePath) => {
// };

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
 * fs#copyFileSync not implemented in memfs
 * this does not accurately mock fs#copyFileSync behaviour as it should not accept directories
 * @see https://stackoverflow.com/a/26038979
 */
function copyFileSync(src, dest) {
  let targetFile = dest;

  // if target is a directory a new file with the same name will be created
  if (fs.existsSync(dest)) {
    if (fs.lstatSync(dest).isDirectory()) {
      targetFile = path.join(dest, path.basename(src));
    }
  }
  console.log(src);
  console.log(targetFile);
  console.log(fs.readFileSync(src))
  console.log(src);
  fs.writeFileSync(targetFile, fs.readFileSync(src));
}

/**
 * @see https://stackoverflow.com/a/26038979
 */
function copyDirRecursiveSync(src, dest) {
  let files = [];
  // check if folder needs to be created or integrated
  const targetFolder = path.join(dest, path.basename(src));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // copy
  if (fs.lstatSync(src).isDirectory()) {
    files = fs.readdirSync(src);
    files.forEach((file) => {
      const curSource = path.join(src, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyDirRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}
/**
 * Mocking fs-extra#emptydirSync
 */
fs.emptydirSync = (dir) => {
  rimraf(dir);
  return fs.mkdirSync(dir);
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
  console.log(src, dest);
  try {
    if (fs.lstatSync(src).isDirectory()) {
      copyDirRecursiveSync(src, dest);
    } else {
      copyFileSync(src, dest);
    }
  } catch (err) {
    reject(err);
  }
});
// /**
//  * Mocking fs-extra-promise#copyAsync
//  *
//  * @param filePath
//  */
// fs.copyAsync = (src, dest, options) => new Promise((resolve, reject) => {
//   const pathObj = path.parse(src);
//   const isDirectory = pathObj.ext === '';
//
//   if (isDirectory) {
//     const newDirectory = fs.mockFileSystem.createDirectory(dest);
//     const directory = fs.mockFileSystem.getDirectory(src);
//     Object.keys(directory.files)
//       .forEach(fileName => newDirectory.storeFileInDir(fileName, directory.files[fileName].content));
//
//     Object.keys(directory.subDirectories).forEach((subDirName) => {
//       fs.copyAsync(path.join(src, subDirName), path.join(dest, subDirName));
//     });
//   } else {
//     fs.mockFileSystem.storeFileInDir(dest);
//   }
//   resolve();
// });
//
// fs.mkdirSync = fs.mkdirSync;

fs.vol = vol;
module.exports = fs;
