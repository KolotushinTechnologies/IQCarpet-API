const { Schema, model } = require("mongoose");

const CountrySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = CountryModel = model("Country", CountrySchema);
