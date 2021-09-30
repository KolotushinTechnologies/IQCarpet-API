const { Schema, model } = require("mongoose");

const CarpetSchema = new Schema(
  {
    nameCarpet: { type: String, required: true },
    workCarpet: { type: String, ref: "WorkCarpet" },
    category: { type: String, ref: "CategoryCarpet" },
    country: { type: String, ref: "Country" },
    carpetMaterial: { type: String, ref: "MaterialCarpet" },
    size: { type: String, required: true },
    formCarpet: { type: String, ref: "FormCarpet" },
    price: { type: String, required: true },
    photos: [{ type: Schema.Types.ObjectId, ref: "Photos" }],
  },
  { timestamps: true }
);

module.exports = CarpetModel = model("Carpet", CarpetSchema);
