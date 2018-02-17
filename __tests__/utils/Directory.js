const File = require('./File');

class Directory {
  constructor(directoryName) {
    this.name = directoryName;
    this.subDirectories = {};
    this.files = {};
  }

  containsFile(fileName) {
    return this.files[fileName] !== undefined;
  }

  storeFile(fileName, content) {
    this.files[fileName] = new File(fileName, content);
  }

  createDirectory(directoryName) {
    const newDirectory = new Directory(directoryName);
    this.subDirectories[directoryName] = newDirectory;
    return newDirectory;
  }

  containsDirectory(directoryName) {
    return this.subDirectories[directoryName] !== undefined;
  }

  getDirectory(directoryName) {
    return this.subDirectories[directoryName];
  }

  getFile(fileName) {
    return this.files[fileName];
  }
}

module.exports = Directory;
