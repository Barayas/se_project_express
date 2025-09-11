const { UNAUTHORIZE } = require("./errors");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZE;
  }
}

module.exports = { UnauthorizedError };
