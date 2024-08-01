const mongoose = require("mongoose");

const google_schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  }
});

module.exports = google_schema;