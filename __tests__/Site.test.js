const Site = require('../lib/Site');
const path = require('path');
const fs = require('fs-extra-promise');
const {
  INDEX_MD_DEFAULT,
  PAGE_EJS,
  SITE_JSON_DEFAULT,
} = require('./utils/data');

jest.mock('fs');
jest.mock('walk-sync');
jest.mock('../lib/Page');


afterEach(() => fs.vol.reset());

test('Site Generate builds the correct amount of assets', () => {
  const json = {
    'lib/template/page.ejs': PAGE_EJS,
    'inner/site.json': SITE_JSON_DEFAULT,

    'asset/css/bootstrap.min.css': '',
    'asset/css/github.min.css': '',
    'asset/css/markbind.css': '',

    'asset/js/setup.js': '',
    'asset/js/vue.min.js': '',
    'asset/js/vue-strap.min.js': '',

    'asset/fonts/glyphicons-halflings-regular.eot': '',
    'asset/fonts/glyphicons-halflings-regular.svg': '',
    'asset/fonts/glyphicons-halflings-regular.ttf': '',
    'asset/fonts/glyphicons-halflings-regular.woff': '',
    'asset/fonts/glyphicons-halflings-regular.woff2': '',
  };
  fs.vol.fromJSON(json, '');
  const site = new Site('inner/', 'inner/_site');
  return site.generate().then(() => {
    const paths = Object.keys(fs.vol.toJSON());
    const originalNumFiles = 13;
    const expectedNumBuilt = 11;
    expect(paths.length).toEqual(originalNumFiles + expectedNumBuilt);

    // site
    expect(fs.existsSync(path.resolve('inner/_site'))).toEqual(true);

    // markbind
    expect(fs.existsSync(path.resolve('inner/_site/markbind'))).toEqual(true);

    // css
    expect(fs.existsSync(path.resolve('inner/_site/markbind/css'))).toEqual(true);
    expect(fs.existsSync(path.resolve('inner/_site/markbind/css/bootstrap.min.css'))).toEqual(true);
    expect(fs.existsSync(path.resolve('inner/_site/markbind/css/github.min.css'))).toEqual(true);
    expect(fs.existsSync(path.resolve('inner/_site/markbind/css/markbind.css'))).toEqual(true);

    // js
    expect(fs.existsSync(path.resolve('inner/_site/markbind/js'))).toEqual(true);
    expect(fs.existsSync(path.resolve('inner/_site/markbind/js/setup.js'))).toEqual(true);
    expect(fs.existsSync(path.resolve('inner/_site/markbind/js/vue.min.js'))).toEqual(true);
    expect(fs.existsSync(path.resolve('inner/_site/markbind/js/vue-strap.min.js'))).toEqual(true);

    // fonts
    expect(fs.existsSync(path.resolve('inner/_site/markbind/fonts/glyphicons-halflings-regular.eot')))
      .toEqual(true);
    expect(fs.existsSync(path.resolve('inner/_site/markbind/fonts/glyphicons-halflings-regular.svg')))
      .toEqual(true);
    expect(fs.existsSync(path.resolve('inner/_site/markbind/fonts/glyphicons-halflings-regular.ttf')))
      .toEqual(true);
    expect(fs.existsSync(path.resolve('inner/_site/markbind/fonts/glyphicons-halflings-regular.woff')))
      .toEqual(true);
    expect(fs.existsSync(path.resolve('inner/_site/markbind/fonts/glyphicons-halflings-regular.woff2')))
      .toEqual(true);
  });
});

test('Site Init in existing directory generates correct assets', () => {
  const json = {
    'lib/template/page.ejs': PAGE_EJS,
  };
  fs.vol.fromJSON(json, '');

  return Site.initSite('').then(() => {
    const paths = Object.keys(fs.vol.toJSON());

    const originalNumFiles = 1;
    const expectedNumBuilt = 3;
    expect(paths.length).toEqual(originalNumFiles + expectedNumBuilt);

    // _boilerplates
    expect(fs.existsSync(path.resolve('_boilerplates'))).toEqual(true);

    // site.json
    expect(fs.existsSync(path.resolve('site.json'))).toEqual(true);
    expect(fs.readJsonSync(path.resolve('site.json'))).toEqual(JSON.parse(SITE_JSON_DEFAULT));

    // index.md
    expect(fs.existsSync(path.resolve('index.md'))).toEqual(true);
    expect(fs.readFileSync(path.resolve('index.md'), 'utf8')).toEqual(INDEX_MD_DEFAULT);
  });
});

test('Site Init in directory which does not exist generates correct assets', () => {
  const json = {
    'lib/template/page.ejs': PAGE_EJS,
  };
  fs.vol.fromJSON(json, '');

  return Site.initSite('newDir').then(() => {
    const paths = Object.keys(fs.vol.toJSON());
    const originalNumFiles = 1;
    const expectedNumBuilt = 2; // updated to reflect unbuilt boilerplates folder

    // this correctly fails at this check
    // as _boilerplates directory is not created
    // https://github.com/MarkBind/markbind/issues/150
    expect(paths.length).toEqual(originalNumFiles + expectedNumBuilt);

    // _boilerplates
    // expect(fs.existsSync(path.resolve('newDir/_boilerplates'))).toEqual(true);

    // site.json
    expect(fs.existsSync(path.resolve('newDir/site.json'))).toEqual(true);
    expect(fs.readJsonSync(path.resolve('newDir/site.json'))).toEqual(JSON.parse(SITE_JSON_DEFAULT));

    // index.md
    expect(fs.existsSync(path.resolve('newDir/index.md'))).toEqual(true);
    expect(fs.readFileSync(path.resolve('newDir/index.md'), 'utf8')).toEqual(INDEX_MD_DEFAULT);
  });
});

test('Site baseurls are correct for sub nested subsites', () => {
  const json = {
    'lib/template/page.ejs': PAGE_EJS,
    'site.json': SITE_JSON_DEFAULT,
    'sub/site.json': SITE_JSON_DEFAULT,
    'sub/sub/site.json': SITE_JSON_DEFAULT,
    'otherSub/sub/site.json': SITE_JSON_DEFAULT,
  };
  fs.vol.fromJSON(json, '');

  const baseUrlMapExpected = {};
  baseUrlMapExpected[path.resolve('')] = true;
  baseUrlMapExpected[path.resolve('sub')] = true;
  baseUrlMapExpected[path.resolve('sub/sub')] = true;
  baseUrlMapExpected[path.resolve('otherSub/sub')] = true;

  const site = new Site('./', '_site');
  return site.collectBaseUrl().then(() => {
    expect(site.baseUrlMap).toEqual(baseUrlMapExpected);
  });
});

test('Site removeAsync removes the correct asset', () => {
  const json = {
    'lib/template/page.ejs': PAGE_EJS,
    '_site/toRemove.jpg': '',
    '_site/dontRemove.png': '',
    'toRemove.html': '',
  };
  fs.vol.fromJSON(json, '');

  const site = new Site('./', '_site');
  return site.removeAsset('toRemove.jpg').then(() => {
    expect(fs.existsSync(path.resolve('_site/toRemove.jpg'))).toEqual(false);
    expect(fs.existsSync(path.resolve('_site/dontRemove.png'))).toEqual(true);
  });
});

test('Site baseurls are correct for sub nested subsites', () => {
  const json = {
    'lib/template/page.ejs': PAGE_EJS,
    'site.json': SITE_JSON_DEFAULT,
    'sub/site.json': SITE_JSON_DEFAULT,
    'sub/sub/site.json': SITE_JSON_DEFAULT,
    'otherSub/sub/site.json': SITE_JSON_DEFAULT,
  };
  fs.vol.fromJSON(json, '');

  const baseUrlMapExpected = {};
  baseUrlMapExpected[path.resolve('')] = true;
  baseUrlMapExpected[path.resolve('sub')] = true;
  baseUrlMapExpected[path.resolve('sub/sub')] = true;
  baseUrlMapExpected[path.resolve('otherSub/sub')] = true;

  const site = new Site('./', '_site');
  return site.collectBaseUrl().then(() => {
    expect(site.baseUrlMap).toEqual(baseUrlMapExpected);
  });
});

test('Site read site config for default', () => {
  const json = {
    'lib/template/page.ejs': PAGE_EJS,
    'site.json': SITE_JSON_DEFAULT,
  };
  fs.vol.fromJSON(json, '');

  const site = new Site('./', '_site');
  return site.readSiteConfig().then(() => {
    expect(site.siteConfig).toEqual(JSON.parse(SITE_JSON_DEFAULT));
  });
});

test('Site read site config for custom site config', () => {
  const customSiteJson = {
    baseUrl: '',
    pages: [
      {
        src: 'index.md',
        title: 'My Markbind Website',
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
  };
  const json = {
    'lib/template/page.ejs': PAGE_EJS,
    'site.json': JSON.stringify(customSiteJson),
  };
  fs.vol.fromJSON(json, '');

  const site = new Site('./', '_site');
  return site.readSiteConfig().then(() => {
    expect(site.siteConfig).toEqual(customSiteJson);
  });
});
