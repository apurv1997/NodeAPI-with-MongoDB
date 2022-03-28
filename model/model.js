// Import Mongoose library.
const mongoose = require("mongoose");

// Construct data Schema for MongoDB.
const dataSchema = new mongoose.Schema({
  UniqueID: {
    required: true,
    type: Number,
  },
  ClientID: {
    required: true,
    type: Number,
  },
  Source: {
    required: true,
    type: String,
  },
  ErrorMsg: {
    required: true,
    type: String,
  },
  Date: {
    required: true,
    type: String,
  },
  MethodName: {
    required: true,
    type: String,
  },
  RoomID: {
    required: true,
    type: Number,
  },
  GameID: {
    required: true,
    type: Number,
  },
});
module.exports = mongoose.model("Data", dataSchema);
