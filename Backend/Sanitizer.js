const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
const intRegex = /^\d+$/;
const floatRegex = /^\d+\.\d+$/;
const htmlRegex = /<.*?>/;
const nonWhitespaceRegex = /\S+/;

/**
 * Validates user input strings.
 * @class
 */
class Sanitizer {
  /**
   * Create a Sanitizer to hold the user input string
   * @constructor
   * @param {string} inputString - The user given input string
   * @throws {Error} Throws an error if the input string is empty
   */
  constructor(inputString) {
    if (!inputString) throw new Error("Input string is undefined");
    if (typeof inputString !== "string") inputString = inputString.toString();
    if (!inputString.match(nonWhitespaceRegex))
      throw new Error("Input string is empty");
    this.inputString = inputString;
    this.clean = false;
    this.problem = [];
  }

  /**
   * Returns the result of all of the validations/sanitization so far
   * @returns {boolean} The result from all previous sanatization and validation checks
   */
  isValid() {
    return this.clean;
  }

  /**
   * Returns a list of problems encountered. Returns null if isValid() is true. See {@link Sanitizer.isValid}
   * @returns {Array<string>} Descriptions of any failed validations/sanitizatins so far. Empty array if the string is clean.
   */
  checkErrors() {
    return this.problem;
  }

  /**
   * Sanitizes the input string of any html tags present in it. Can check results with {@link Sanitizer.isValid}
   * @returns {this} - Allows for chaining of sanitizations/validations
   */
  sanitize() {
    this._sanitizeHtml();
    return this;
  }

  _sanitizeHtml() {
    if (this.inputString.match(htmlRegex)) {
      this.problem.push("Html sanitization failed.\nThis string contains html");
      this.clean = false;
      return;
    }
    this.clean = true;
  }

  /**
   * Validates that the user string is a valid email address. Can check results with {@link Sanitizer.isValid}
   * @returns {this} - Allows for chaining of sanitizations/validations
   */
  validateEmail() {
    if (this.inputString.match(emailRegex)) {
      this.clean = true;
      return this;
    }
    this.clean = false;
    this.problem.push(
      "Email validation failed.\nThis string does not contain a valid email address"
    );
    return this;
  }

  /**
   * Validates that the user string is a valid integer. Can check results with {@link Sanitizer.isValid}
   * @returns {this} - Allows for chaining of sanitizations/validations
   */
  validateInt() {
    if (this.inputString.match(intRegex)) {
      this.clean = true;
      return this;
    }
    this.clean = false;
    this.problem.push(
      "Int validation failed.\nThis string contains non-digit characters"
    );
    return this;
  }

  /**
   * Validats that the user string is a valid float. Will not fail in the case where an integer is supplied. Can check results with {@link Sanitizer.isValid}
   * @returns {this} - Allows for chaining of sanitizations/validations
   */
  validateFloat() {
    if (
      this.inputString.match(floatRegex) ||
      this.inputString.match(intRegex)
    ) {
      this.clean = true;
      return this;
    }
    this.clean = false;
    this.problem.push(
      "Float validation failed.\nThis string contains non-digit characters (excluding the decimal)"
    );
    return this;
  }
}

module.exports = Sanitizer;
