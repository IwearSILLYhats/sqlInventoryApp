const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
});

const query = (text, params, callback) => {
    return pool.query(text, params, callback)
};

module.exports = query;