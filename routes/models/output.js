const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const EditorOutputSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  user: {
    type: ObjectId,
    ref: "user",
  },
});

const EditorOutput = mongoose.model("editorOutput", EditorOutputSchema);

module.exports = EditorOutput;
