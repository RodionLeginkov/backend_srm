const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const verify = require("../middleware/check-auth")

let Project = require("../models/project.model")

router.route("/").get(async (req, res) => {
  try {
    const info = await Project.find()
    res.json(info)
  }
  catch (err) {
    res.status(400).json("Error: " + err)
  }
})


//ADD MIDDLEWARE (CHECK-AUTH) WHERE IT NEEDS (PRIVATE FUNCTION)
//CHECK LOGIN WHEN YOU WORK WITH PROJECT 

//ADD NEW PROJECT



router.post("/addproject", async (req, res) => {
  try {

    const newproject = new Project({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      statys: req.body.statys,
      stack: req.body.stack,
      price: req.body.price,
      rating: req.body.rating,
      description: req.body.description
    })
    const savedProject = await newproject.save()
    res.status(201).json({ message: "Created project successfully" })


  } catch (err) { res.status(400).json("Error: " + err) };
});


//DELETE PROJECT
router.delete("/:projectId", async (req, res, next) => {
  try {
    const project = await Project.remove({ _id: req.params.projectId })
    res.status(200).json({ message: "User deleted" })

  }
  catch (err) {
    res.status(500).json("Error: " + err)
  };
});


//CHANGE PROJECT 

router.patch("/:projectId", verify, async (req, res, next) => {
  try {
    const id = req.params.projectId;
    const updateOps = {};


    for (const ops of req.body) {
      console.log("hello")
      updateOps[ops.propName] = ops.value;
      console.log(ops.value)
    }

    Project.update({ _id: id }, { $set: updateOps })
    res.status(200).json({ message: "Project updated" })
  } catch (err) {
    res.status(500).json("Error: " + err)
  };
})


module.exports = router;