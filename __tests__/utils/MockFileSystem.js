const path = require('path');
const Directory = require('./Directory');

/**
 * A mock of a file system which contains Directories in a tree structure
 * Entry point for directories
 * A Directory can contain subdirectories and files
 */
class MockFileSystem {
  constructor() {
    // Create a base directory to make operations easier
    this.mainDirectory = new Directory('');
  }

  /**
   *  Directory Operations
   */

  /**
   * Creates a directory based on dir name
   * Will create intermediate directories if they do not exist
   *
   * @param directory {string} directory's path
   * @returns {Directory} the newly created directory
   * directory returned will be the deepest one ie: dirPath = 'path/to/dir/'
   * will return Directory with 'dir' as its name
   */
  createDirectory(directory) {
    const { dirNames } = splitPath(directory);
    return this.getDeepestDir(dirNames);
  }

  /**
   * Checks if directory exists at directory path
   *
   * @param directory {string} directory's path
   * @returns {boolean}
   */
  containsDirectory(directory) {
    const { dirNames } = splitPath(directory);
    let currentDirectory = this.mainDirectory;

    for (let i = 0; i < dirNames.length; i += 1) {
      const dirName = dirNames[i];
      if (!currentDirectory.containsDirectoryInDir(dirName)) {
        return false;
      }
      currentDirectory = currentDirectory.getDirectoryInDir(dirName);
    }
    return true;
  }

  /**
   * Retrieves directory stated directory path
   *
   * @param directory {string} directory's path
   * @returns {Directory|undefined}
   */
  getDirectory(directory) {
    const { dirNames } = splitPath(directory);

    let currentDirectory = this.mainDirectory;

    for (let i = 0; i < dirNames.length; i += 1) {
      const dirName = dirNames[i];
      if (!currentDirectory.containsDirectoryInDir(dirName)) {
        return undefined;
      }
      currentDirectory = currentDirectory.getDirectoryInDir(dirName);
    }
    return currentDirectory;
  }

  /**
   * Creates nested directories based on directory names
   * Will create intermediate directories if they do not exist
   * Try not to use outside of this class
   *
   * @param dirNames {string[]} directory names ordered with increasing depth
   * @returns {Directory} the newly created directory
   * directory returned will be the deepest one ie: dirPath = 'path/to/dir/'
   * will return Directory with 'dir' as its name
   */
  getDeepestDir(dirNames) {
    let currentDirectory = this.mainDirectory;

    dirNames.forEach((dirName) => {
      if (currentDirectory.containsDirectoryInDir(dirName)) {
        currentDirectory = currentDirectory.getDirectoryInDir(dirName);
      } else {
        currentDirectory = currentDirectory.createDirectoryInDir(dirName);
      }
    });

    return currentDirectory;
  }

  /**
   *  File Operations
   */

  /**
   * Stores a file at a destination file path
   * Will create intermediate directories if they do not exist
   *
   * @param filePath {string} destination file path
   * @param content {string|Object} content of file to store
   */
  storeFile(filePath, content) {
    const { file, dirNames } = splitPath(filePath);
    this.getDeepestDir(dirNames).storeFileInDir(file, content);
  }

  /**
   * Checks if file exists at file path
   *
   * @param filePath {string} path to file you want to check
   * @returns {boolean}
   */
  containsFile(filePath) {
    const { file, dir } = splitPath(filePath);
    if (!this.containsDirectory(dir)) {
      return false;
    }
    return this.getDirectory(dir).containsFileInDir(file);
  }

  /**
   * Retrieves the File located a filepath
   * Returns undefined if file does not exist
   *
   * @param filePath {string} path to file you want to access
   * @returns {File|undefined} file
   */
  getFile(filePath) {
    const { file, dir } = splitPath(filePath);

    if (!this.containsFile(filePath)) {
      return undefined;
    }
    return this.getDirectory(dir).getFileInDir(file);
  }

  /**
   * Retrieves the content of file located a filepath
   * Returns undefined if file does not exist
   *
   * @param filePath {string} path to file you want to access
   * @returns {string|Object|undefined} content of the file
   */
  getFileContent(filePath) {
    const file = this.getFile(filePath);
    return file ? file.content : undefined;
  }
}

/**
 *  Util
 */

const splitPath = (pathArg) => {
  const pathObj = path.parse(pathArg);
  const isDirectory = pathObj.ext === '';
  const dir = isDirectory ? pathArg : pathObj.dir;
  const { base: file } = pathObj;
  const dirNames = dir.split(path.sep);

  return { file, dir, dirNames };
};

module.exports = MockFileSystem;
