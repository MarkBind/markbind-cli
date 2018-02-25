const Site = require('../lib/Site');
const path = require('path');
const fs = require('fs-extra-promise');

jest.mock('fs');
jest.mock('walk-sync');
jest.mock('../lib/Page');

test('Site Generate builds the correct amount of assets', () => {
  const json = {
    './lib/template/page.ejs':
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
      + '</html>\n',

    './inner/site.json': '{\n'
    + '  "baseUrl": "",\n'
    + '  "pages": [\n'
    + '    {\n'
    + '      "src": "index.md",\n'
    + '      "title": "Hello World"\n'
    + '    }\n'
    + '  ],\n'
    + '  "ignore": [\n'
    + '    "_site/*",\n'
    + '    "*.json",\n'
    + '    "*.md"\n'
    + '  ],\n'
    + '  "deploy": {\n'
    + '    "message": "Site Update."\n'
    + '  }\n'
    + '}\n',

    './asset/css/bootstrap.min.css': '',
    './asset/css/github.min.css': '',
    './asset/css/markbind.css': '',

    './asset/js/setup.js': '',
    './asset/js/vue.min.js': '',
    './asset/js/vue-strap.min.js': '',

    './inner/index.md': '',
  };
  fs.vol.fromJSON(json, './');
  const site = new Site('./inner/', './inner/_site');
  return site.generate().then(() => {

    const paths = Object.keys(fs.vol.toJSON());

    // site
    expect(fs.existsSync(path.resolve('./inner/_site'))).toBeTruthy();

    // markbind
    expect(fs.existsSync(path.resolve('./inner/_site/markbind'))).toBeTruthy();

    // css
    expect(fs.existsSync(path.resolve('./inner/_site/markbind/css'))).toBeTruthy();
    expect(fs.existsSync(path.resolve('./inner/_site/markbind/css/bootstrap.min.css'))).toBeTruthy();
    expect(fs.existsSync(path.resolve('./inner/_site/markbind/css/github.min.css'))).toBeTruthy();
    expect(fs.existsSync(path.resolve('./inner/_site/markbind/css/markbind.css'))).toBeTruthy();

    // js
    expect(fs.existsSync(path.resolve('./inner/_site/markbind/js'))).toBeTruthy();
    expect(fs.existsSync(path.resolve('./inner/_site/markbind/js/setup.js'))).toBeTruthy();
    expect(fs.existsSync(path.resolve('./inner/_site/markbind/js/vue.min.js'))).toBeTruthy();
    expect(fs.existsSync(path.resolve('./inner/_site/markbind/js/vue-strap.min.js'))).toBeTruthy();
  });

});
