const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const PlanSchema = new Schema({
  api: { type: String, default: "" },
  url: { type: String, default: "" },
  //   favorite: { type: Boolean, default: false }, // star //

  inputLength: {
    type: Number,
    default: 0,
    integer: true,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },

  outputLength: {
    type: Number,
    default: 0,
    integer: true,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },

  credits: {
    type: Number,
    default: 0,
    integer: true,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },

  price: { type: Number, default: 0 },

  created: { type: Date, default: Date.now },
  user: {
    type: ObjectId,
    ref: "user",
  },
  output: {
    type: ObjectId,
    ref: "editorOutput",
  },
  planName: {
    type: String,
    required: true,
  },
  planFormFields: {
    type: Map,
    of: String | Object,
  },
});

PlanSchema.plugin(AutoIncrement, { inc_field: "id" });

const Plan = mongoose.model("Plan", PlanSchema);

module.exports = Plan;

