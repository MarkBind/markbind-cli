const File = require('./File');

/**
 * A mock directory
 * A directory can contain sub directories or files
 */
class Directory {
  constructor(directoryName) {
    this.name = directoryName;
    this.subDirectories = {};
    this.files = {};
  }

  /**
   * Directory operations
   */

  /**
   * Creates a subdirectory in this directory
   *
   * @param {string} directoryName
   * @returns {Directory} the newly created subdirectory
   */
  createDirectoryInDir(directoryName) {
    const newDirectory = new Directory(directoryName);
    this.subDirectories[directoryName] = newDirectory;
    return newDirectory;
  }

  /**
   * Get subdirectory in this directory
   * return undefined if sub directory does not exist
   *
   * @param directoryName
   * @returns {Directory|undefined}
   */
  getDirectoryInDir(directoryName) {
    return this.subDirectories[directoryName];
  }

  /**
   * Checks if subdirectory exists in this directory
   *
   * @param {string} directoryName
   * @returns {boolean}
   */
  containsDirectoryInDir(directoryName) {
    return this.getDirectoryInDir(directoryName) !== undefined;
  }

  /**
   * File Operations
   */

  /**
   * Stores file in directory
   *
   * @param {string} fileName
   * @param {string|Object} content
   */
  storeFileInDir(fileName, fileContent) {
    this.files[fileName] = new File(fileName, fileContent);
  }

  /**
   * Get file in this directory
   * return undefined if file does not exist
   *
   * @param fileName
   * @returns {File|undefined}
   */
  getFileInDir(fileName) {
    return this.files[fileName];
  }

  /**
   * Checks if directory contains the file with file name
   * @param {string} fileName
   * @returns {boolean}
   */
  containsFileInDir(fileName) {
    return this.getFileInDir(fileName) !== undefined;
  }
}

module.exports = Directory;
