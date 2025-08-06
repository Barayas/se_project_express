const BAD_REQUEST = 400;
const UNAUTHORIZE = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT_ERROR = 409;
const INTERNAL_SERVER_ERROR = 500;

const handleNotFound = (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
};

module.exports = {
  handleNotFound,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZE,
  FORBIDDEN,
};
