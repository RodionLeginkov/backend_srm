const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: false },
    status: { type: String, required: false },
    stack: { type: String, required: false },
    price: { type: Number, required: false },
    description: { type: String, required: false }
    //userImage: String
  }
)

module.exports = mongoose.model("Project", projectSchema)