const { Schema, model } = require("mongoose");

const RoleSchema = new Schema({
  value: {
    type: String,
    unique: true,
    default: "USER",
  },
});

module.exports = RoleModel = model("Role", RoleSchema);
