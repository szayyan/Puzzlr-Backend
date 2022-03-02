const { MongoClient } = require("mongodb");
require('dotenv').config()

// TODO: consider implications of using a global variable in regards to: program structure, issues with recconecting, how nodejs handles concurrent requests
// alternative approach could be to connect on every request
let _database

function connect_to_database(db_name, callback)
{
    const client = new MongoClient(process.env.MONGO_URI)
    client.connect( (err, cluster) => {
        if( cluster ) {
            _database = cluster.db(db_name);
        }
        return callback(err)
    })
}

function get_database()
{
    return _database;
}

module.exports = { connect_to_database, get_database }