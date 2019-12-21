const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const problemSchema = new Schema(
  {
    author: {
      id: { require: true, type: Schema.Types.ObjectId }
    },
    comments: [
      {
        id: {
          require: true,
          type: Schema.Types.ObjectId
        }
      },
      {
        timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
      }
    ],
    description: { require: true, type: String },
    dailyUpvotes: { require: true, type: Number },
    gender: { require: true, type: Number },
    tags: [{ name: { type: String } }],
    title: { require: true, type: String },
    upVotes: { require: true, type: Number },
    upVotesList: [{ userID: { type: Schema.Types.ObjectId } }]
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);
problemSchema.index({ title: "text" });

module.exports = mongoose.model("problems", problemSchema);
