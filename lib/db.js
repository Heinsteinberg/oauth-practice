const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = require('lowdb')(adapter);

db.defaults({
    users: []
}).write();

module.exports = db;