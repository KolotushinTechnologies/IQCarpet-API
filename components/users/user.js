const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    iAmSeller: { type: Boolean },
    companyName: { type: String, required: isFieldRequired },
    birthDay: { type: String, required: true },
    location: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true },
    avatar: { type: Schema.Types.ObjectId, ref: "Avatar" },
    login: { type: String, required: true, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, sparse: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: "Role" }],
    emailVerifyCode: { type: String },
  },
  {
    timestamps: true,
  }
);

function isFieldRequired() {
  return this.iAmSeller === true ? true : false;
}

module.exports = UserModel = model("User", UserSchema);
