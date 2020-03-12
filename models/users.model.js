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
    name:{ type: String, required: false },
    surname:{ type: String, required: false },
    skills:{ type: String, required: false },
    englishLevel:{ type: String, required: false },
    skype: { type: String, required: false },
    github: { type: String, required: false },
    phoneNumber: { type: Number, required: false },
    currentProject: { type: String, required: false },
    stack:{ type: Array, required:false},
    status:{ type:String, required:false},
    country:{ type:String, required:false},
    isAdmin:{type:Boolean, default:false},
    userImage: {type: String, required:false},
    resetPasswordToken: {type:String},
    resetPasswordExpires: {type:Date}
    //userImage: String
  }
)

module.exports = mongoose.model("Users", userSchema)