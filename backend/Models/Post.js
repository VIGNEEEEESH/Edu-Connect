const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  classNumber: { type: String, required: true,ref:"Detail" },
  content: { type: String, required: true },
  replies: [String],
  image:{type:String}

});

module.exports = mongoose.model("Post", postSchema);
