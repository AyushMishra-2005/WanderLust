const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const reviewSchama = new Schema({
  comment : {
    type : String
  },

  rating : {
    type : Number,
    min : 1, 
    max : 5,
  }, 

  cratedAt : {
    type : Date,
    default: Date.now(),
  }, 

  author : {
    type : Schema.Types.ObjectId,
    ref : "User",
  }
});


module.exports = mongoose.model("Review", reviewSchama);