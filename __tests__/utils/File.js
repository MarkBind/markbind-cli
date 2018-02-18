/**
 * Mock file
 */
class File {
  /**
   * If content not provided, use empty string as content
   * Applicable to files whose content are not relevant for testing
   *
   * @param {string} name
   * @param {string|Object|undefined} content
   */
  constructor(name, content = '') {
    this.name = name;
    this.content = content;
  }
}

module.exports = File;
