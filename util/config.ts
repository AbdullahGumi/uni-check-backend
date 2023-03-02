require("dotenv").config();

module.exports = {
  DATABASE_URL_DEVELOPMENT: process.env.DATABASE_URL_DEVELOPMENT,
  PORT: process.env.PORT || 3001,
};
