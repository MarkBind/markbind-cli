const Site = require('../lib/Site');
const MockFileSystem = require('./utils/MockFileSystem');
const path = require('path');
const fs = require('fs-extra-promise');
const walkSync = require('walk-sync');

jest.mock('fs');
jest.mock('walk-sync');
jest.mock('../lib/Page');

const getPath = (...toJoin) => path.resolve(toJoin.join(path.sep));

const mockFileSystem = new MockFileSystem();
mockFileSystem.storeFile(getPath('index.md'));
mockFileSystem.createDirectory(getPath('_boilerplates'));
mockFileSystem.storeFile(getPath('site.json'), {
  baseUrl: '',
  pages: [
    {
      src: 'index.md',
      title: 'Hello World',
    },
  ],
  ignore: [
    '_site/*',
    '*.json',
    '*.md',
  ],
  deploy: {
    message: 'Site Update.',
  },
});

mockFileSystem
  .storeFile(getPath('lib', 'template', 'page.ejs'),
             '<!DOCTYPE html>\n'
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
           + '</html>\n');

mockFileSystem.createDirectory(getPath('asset'));

mockFileSystem.storeFile(getPath('asset', 'css', 'bootstrap.min.css'));
mockFileSystem.storeFile(getPath('asset', 'css', 'github.min.css'));
mockFileSystem.storeFile(getPath('asset', 'css', 'markbind.css'));

mockFileSystem.createDirectory(getPath('asset', 'fonts'));
// all the fonts should be here..

mockFileSystem.storeFile(getPath('asset', 'js', 'setup.js'));
mockFileSystem.storeFile(getPath('asset', 'js', 'vue.min.js'));
mockFileSystem.storeFile(getPath('asset', 'js', 'vue-strap.min.js'));


test('Site Generate builds the correct amount of assets', () => {
  fs.mockFileSystem = mockFileSystem;
  walkSync.mockFileSystem = mockFileSystem;
  const site = new Site(path.resolve(''), path.resolve('_site'));
  return site.generate().then(() => {
    // _site folder
    expect(mockFileSystem.containsDirectory(getPath('_site'))).toBeTruthy();

    // markbind assets
    expect(mockFileSystem.containsDirectory(getPath('_site', 'markbind'))).toBeTruthy();

    // js
    expect(mockFileSystem.containsDirectory(getPath('_site', 'markbind', 'js'))).toBeTruthy();
    expect(mockFileSystem.containsFile(getPath('_site', 'markbind', 'js', 'setup.js'))).toBeTruthy();
    expect(mockFileSystem.containsFile(getPath('_site', 'markbind', 'js', 'vue.min.js'))).toBeTruthy();
    expect(mockFileSystem.containsFile(getPath('_site', 'markbind', 'js', 'vue-strap.min.js'))).toBeTruthy();

    // css
    expect(mockFileSystem.containsDirectory(getPath('_site', 'markbind', 'css'))).toBeTruthy();
    expect(mockFileSystem.containsFile(getPath('_site', 'markbind', 'css', 'bootstrap.min.css'))).toBeTruthy();
    expect(mockFileSystem.containsFile(getPath('_site', 'markbind', 'css', 'github.min.css'))).toBeTruthy();
    expect(mockFileSystem.containsFile(getPath('_site', 'markbind', 'css', 'markbind.css'))).toBeTruthy();

    // fonts
    expect(mockFileSystem.containsDirectory(getPath('_site', 'markbind', 'fonts'))).toBeTruthy();

    console.log(mockFileSystem.mainDirectory
      .subDirectories['D:']
      .subDirectories['NUS Year 2']
      .subDirectories.SEM2
      .subDirectories.markbind
      .subDirectories['markbind-cli']
      .subDirectories['_site']
      .subDirectories['markbind']
      .subDirectories['js']);
  });
});
