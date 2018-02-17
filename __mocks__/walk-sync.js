// Mock specific functions of walk-sync module
// usually used for number of site.jsons
const path = require('path');

const walkSync = (directory) => {
  // not comprehensive of sub-sites yet.
  const toRet = Object.keys(walkSync.mockDirectory.getDirectory(directory).files);
  return toRet;
};


module.exports = walkSync;
