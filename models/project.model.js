const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: false },
    statys: { type: String, required: false },
    workers: { type: String, required: false },
    salaries: { type: Number, required: false },
    rating: { type: Number, required: false }
    //userImage: String
  }
)

module.exports = mongoose.model("Project", projectSchema)