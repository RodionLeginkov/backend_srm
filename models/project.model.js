const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    status: { type: String, required: false },
    stack: { type: Array, required: false },
    price: { type: Number, required: false },
    duration: { type: String, required: false},
    description: { type: String, required: false },
    /////////
    group:{ type: Array, required: false },
    name: { type: String, required: true },
    formatOfCommunication:{ type: Array, required: false },
    messager:{ type: Array, required: false },
    startData:{ type: Date, required: false },
    endData:{ type: Date, required: false },
    type:{ type: String, required: false },
    source:{ type: String, required: false},
    withdrawalOfFunds:{ type: String, required: false},
    owner:{ type: String, required: false},


    projectImage: {type: String, required:false},
    developers: {type: Array, required:false}
  }
)

module.exports = mongoose.model("Project", projectSchema)