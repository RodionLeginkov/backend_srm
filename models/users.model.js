const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      required: true,
      unique: true,
      max: 255,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    },
    password: { type: String, required: true, min: 6 },
    login: { type: String, required: false, max: 255 },
    skype: { type: String, required: false },
    github: { type: String, required: false },
    phoneNumber: { type: Number, required: false },
    currentProject: { type: String, required: false }
    //userImage: String
  }
)

module.exports = mongoose.model("Users", userSchema)