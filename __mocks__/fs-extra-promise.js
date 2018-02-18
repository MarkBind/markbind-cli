// Mock specific functions of fs-extra-promise module
const fs = jest.genMockFromModule('fs-extra-promise');
const path = require('path');

fs.mockFileSystem;

/**
 * Mocking fs#readFileSync:
 * https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
 * @param filepath
 * @param options
 * @returns {string}
 */

fs.readFileSync = (filepath, options) => fs.mockFileSystem.getFileContent(filepath);


/**
 * Mocking fs-extra#emptydirSync
 *
 * @param filePath
 */
fs.emptydirSync = (filePath) => {
};

/**
 * Mocking fs-extra-promise#readJsonAsync
 *
 * @param filePath
 */
fs.readJsonAsync = filePath => Promise.resolve(fs.mockFileSystem.getFileContent(filePath));

/**
 * Mocking fs-extra-promise#copyAsync
 *
 * @param filePath
 */
fs.copyAsync = (src, dest, options) => new Promise((resolve, reject) => {
  const pathObj = path.parse(src);
  const isDirectory = pathObj.ext === '';

  if (isDirectory) {
    const newDirectory = fs.mockFileSystem.makeDirectory(dest);
    const directory = fs.mockFileSystem.getDirectory(src);
    Object.keys(directory.files).forEach(fileName => newDirectory.storeFile(fileName, directory.files[fileName].content));

    Object.keys(directory.subDirectories).forEach((subDirName) => {
      fs.copyAsync(path.join(src, subDirName), path.join(dest, subDirName));
    });
  } else {
    fs.mockFileSystem.storeFile(dest);
  }
  resolve();
});

module.exports = fs;
