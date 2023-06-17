const mongoose = require("mongoose");

const IpSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
      unique: true,
    },
    credits: {
      type: Number,
      default: 1000,
      integer: true,
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
    },
    creditsUsed: {
      type: Number,
      default: 0,
      integer: true,
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
    },
  },
  { timestamps: true }
);

const Ip = mongoose.model("Ip", IpSchema);

module.exports = Ip;
