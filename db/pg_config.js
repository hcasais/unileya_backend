const pg = require('pg');

const conString = "postgres://idienqkl:O3dzaGVcLNI8ZOfETQREuKpZCJwnfjqz@tuffi.db.elephantsql.com/idienqkl";
const client = new pg.Client(conString);

module.exports = client;
