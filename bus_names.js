const mongoose = require("mongoose");

const bus_names_Schema = new mongoose.Schema({  
  names: {
    type: Array,   
  },
  timings: {
    type: Array,   
  }
  
});


// const User = mongoose.model("User", UserSchema);

module.exports = bus_names_Schema;


