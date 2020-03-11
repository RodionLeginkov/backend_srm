const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    status: { type: String, required: false },
    stack: { type: Array, required: false },
    price: { type: Number, required: false },
    duration: { type: String, required: false},
    description: { type: String, required: false },
    projectImage: {type: String, required:false},
    developers: {type: Array, required:false}
  }
)

module.exports = mongoose.model("Project", projectSchema)