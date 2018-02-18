const path = require('path');
const Directory = require('./Directory');

class MockFileSystem {
  constructor() {
    this.mainDirectory = new Directory('');
  }

  splitFilePath(filePath) {
    const pathArray = filePath.split(path.sep);
    const file = pathArray[pathArray.length - 1];
    const dirNames = pathArray.slice(0, pathArray.length - 1);

    return { file, dirNames };
  }

  storeFile(filePath, content) {
    const { file, dirNames } = this.splitFilePath(filePath);
    this.getDeepestDir(dirNames).storeFile(file, content);
  }

  getFileContent(filePath) {
    const { file, dirNames } = this.splitFilePath(filePath);
    console.log(filePath);
    console.log(file);
    return this.getDeepestDir(dirNames).getFile(file).content;
  }

  makeDirectory(dirName) {
    const dirNames = dirName.split(path.sep);
    return this.getDeepestDir(dirNames);
  }

  getDeepestDir(dirNames) {
    let currentDirectory = this.mainDirectory;

    dirNames.forEach((dirName) => {
      if (currentDirectory.containsDirectory(dirName)) {
        currentDirectory = currentDirectory.getDirectory(dirName);
      } else {
        currentDirectory = currentDirectory.createDirectory(dirName);
      }
    });

    return currentDirectory;
  }

  containsFile(filePath) {
    const { file, dirNames } = this.splitFilePath(filePath);
    return this.getDeepestDir(dirNames).containsFile(file);
  }

  getDirectory(directory) {
    console.log(directory);
    const dirNames = directory.split(path.sep);

    let currentDirectory = this.mainDirectory;

    for (let i = 0; i < dirNames.length; i += 1) {
      const dirName = dirNames[i];
      if (!currentDirectory.containsDirectory(dirName)) {
        return null;
      }
      currentDirectory = currentDirectory.getDirectory(dirName);
    }
    return currentDirectory;
  }

  containsDirectory(directory) {
    console.log(directory);
    const dirNames = directory.split(path.sep);

    let currentDirectory = this.mainDirectory;

    for (let i = 0; i < dirNames.length; i += 1) {
      const dirName = dirNames[i];
      if (!currentDirectory.containsDirectory(dirName)) {
        return false;
      }
      currentDirectory = currentDirectory.getDirectory(dirName);
    }
    return true;
  }
}

module.exports = MockFileSystem;
