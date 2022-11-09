const Mongoose = require("mongoose");
const { Schema } = Mongoose;

//Comment Schema
const commentSchema = new Schema();

// Article Schema
const ArticleSchema = new Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  author: {
    id:  {type: String },
    firstName:  {type: String },
    lastName:  {type: String} ,
    email: {type: String}
  },
  numLikes: {type: Number, default: 0},
  comments: [{
  commentatorId: { type: String },
  comment: { type: String },
}],
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

//Creating User Model
const ArticleModel = Mongoose.model("Article", ArticleSchema);

module.exports = ArticleModel;
