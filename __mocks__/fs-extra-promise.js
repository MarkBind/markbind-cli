// Mock specific functions of fs-extra-promise module
const fs = jest.genMockFromModule('fs-extra-promise');
const path = require('path');

fs.mockDirectory;

/**
 * Mocking fs#readFileSync:
 * https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
 * @param filepath
 * @param options
 * @returns {string}
 */

fs.readFileSync = (filepath, options) => {
  const { base } = path.parse(filepath);
  switch (base) {
  case 'page.ejs':
    return '<!DOCTYPE html>\n'
      + '<html>\n'
      + '<head>\n'
      + '    <meta charset="utf-8">\n'
      + '    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n'
      + '    <meta name="viewport" content="width=device-width, initial-scale=1">\n'
      + '    <title><%= title %></title>\n'
      + '    <link rel="stylesheet" href="<%- asset.bootstrap %>">\n'
      + '    <link rel="stylesheet" href="<%- asset.highlight %>">\n'
      + '    <link rel="stylesheet" href="<%- asset.markbind %>">\n'
      + '</head>\n'
      + '<body>\n'
      + '<div id="app" class="container-fluid">\n'
      + '    <%- content %>\n'
      + '</div>\n'
      + '</body>\n'
      + '<script src="<%- asset.vue %>"></script>\n'
      + '<script src="<%- asset.vueStrap %>"></script>\n'
      + '<script src="<%- asset.setup %>"></script>\n'
      + '</html>\n';
  default:
    return 'haha';
  }
};


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
fs.readJsonAsync = filePath => Promise.resolve(fs.mockDirectory.getFileContent(filePath));

/**
 * Mocking fs-extra-promise#copyAsync
 *
 * @param filePath
 */
fs.copyAsync = (src, dest, options) => new Promise((resolve, reject) => {
  console.log(dest);
  fs.mockDirectory.storeFile(dest, src);
  resolve();
});

module.exports = fs;
