const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    //OLD
    _id: mongoose.Schema.Types.ObjectId,
    status: { type: String, required: false },
    stack: { type: Array, required: false },
    price: { type: Number, required: false },
    duration: { type: String, required: false},
    /////////
    //NEW
    group:{ type: Array, required: false },
    name: { type: String, required: true },
    comunication:{ type: String, required: true },
    messager:{ type: Array, required: false },
    startDate:{ type: String, required: true },
    endDate:{ type: String, required: false },
    type:{ type: String, required: true },
    source:{ type: String, required: true},
    withdrawalOfFunds:{ type: String, required: true},
    owner:{ type: String, required: false},
    paymentType:{ type: String, required: true },
    paymentAmount:{ type: String, required: true },
    load:{ type: String, required: true},
    description: { type: String, required: false },
    resources: { type: Array, required: true },
    history:{ type: String, required: false },
    projectImage: {type: String, required:false},
    developers: {type: Array, required:false}
  }
)

module.exports = mongoose.model("Project", projectSchema)