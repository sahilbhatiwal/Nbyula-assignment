// custom erro class
class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.stackTraceLimit = 1;
  }
}

module.exports = CustomError;
