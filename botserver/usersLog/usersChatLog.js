//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var mongoose = require('mongoose');

// Connection URL. This is where your mongodb server is running.
var url = process.env.DB_URL;

const addNewChatLog = (log) => {
  mongoose.connect(process.env.DB_URL);
  var conn = mongoose.connection;

  var ObjectID = require('mongodb').ObjectID;
  var chatLog = {
    log: log,
    _id: ObjectID()
  };

  conn.collection(process.env.COLLECTION_CHATLOG).insert(chatLog);
  console.log(chatLog);
};

module.exports = {
  logMessage: addNewChatLog,
};
