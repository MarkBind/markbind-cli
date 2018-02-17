const Site = require('../lib/Site');
const MockFileSystem = require('./utils/MockFileSystem');
const path = require('path');
const fs = require('fs-extra-promise');
const walkSync = require('walk-sync');

jest.mock('fs');
jest.mock('walk-sync');
jest.mock('../lib/Page');

// if you are testing with npm run test, ROOT = path/to/markbind-cli/
const ROOT = path.resolve('');

const mockDirectory = new MockFileSystem();
mockDirectory.storeFile(path.resolve(ROOT, 'index.md'));
mockDirectory.makeDirectory(path.resolve(ROOT, '_boilerplates'));
mockDirectory.storeFile(path.resolve(ROOT, 'site.json'), {
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

test('site test', () => {
  fs.mockDirectory = mockDirectory;
  walkSync.mockDirectory = mockDirectory;
  const site = new Site(ROOT, path.join(ROOT, '_site'));
  return site.generate().then(() => {
    expect(mockDirectory.containsFile(path.resolve(ROOT, 'index.md'))).toBeTruthy();
    expect(mockDirectory.containsDirectory(path.resolve(ROOT, '_boilerplates'))).toBeTruthy();
    expect(mockDirectory.containsFile(path.resolve(ROOT, 'site.json'))).toBeTruthy();
    expect(mockDirectory.containsDirectory(path.resolve(ROOT, '_site'))).toBeTruthy();

    // currently copied directories will be saved as File as there is no way to reproduce the
    // sub directories without reading from disk
    expect(mockDirectory.containsFile(path.resolve(ROOT, `_site${path.sep}markbind`))).toBeTruthy();
    expect(mockDirectory.getFileContent(path.resolve(ROOT, `_site${path.sep}markbind`)))
      .toEqual(path.resolve(ROOT, 'asset'));
  });
});
