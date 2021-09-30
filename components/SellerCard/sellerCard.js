const { Schema, model } = require("mongoose");

const SellerCardSchema = new Schema({
  iAmSeller: { type: Boolean }, // TODO: sellerStatus
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  phoneNumberOne: { type: String, unique: true, required: true },
  phoneNumberTwo: { type: String },
  avatar: { type: Schema.Types.ObjectId, ref: "Avatar" },
  emailOne: { type: String, required: true, unique: true, sparse: true },
  emailTwo: { type: String, unique: true, sparse: true },
  carpets: [{ type: Schema.Types.ObjectId, ref: "Carpet" }],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = SellerCardModel = model("SellerCard", SellerCardSchema);
