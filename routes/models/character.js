const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CharacterSchema = new Schema(
  {
    characterProfileImage: {
      type: String
    },
    characterName: {
      type: String,
      trim: true,
      required: true,
      maxLength: 200
    },
    characterTitle: {
      type: String,
      trim: true,
      required: true,
      maxLength: 200
    },
    characterDescription: {
      type: String,
      required: true,
      maxLength: 5000
    },
    characterOwnerName: {
      type: String,
      trim: true,
      maxLength: 200,
      default: "Admin"
    },
    characterCategory: {
      type: [Schema.Types.Mixed]
    },
    profilePhoto: {
      type: String,
      default: null
    },
    characterWeight: {
      type: Number,
      default: 1,
      integer: true
    },
    characterStartingSentence: {
      type: String
    },
    characterViewsCount: {
      type: Number,
      default: 0
    },
    prompt: {
      type: String
    },
    isDraft: {
      type: Boolean,
      default: true
    },
    isLocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const User = mongoose.model("character", CharacterSchema);
module.exports = User;
