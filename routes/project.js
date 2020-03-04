const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const verify = require("../middleware/check-auth")

let Project = require("../models/project.model")

router.route("/",verify).get(async (req, res) => {
  try {
    const info = await Project.find()
    res.json(info)
  }
  catch (err) {
    res.status(400).json("Error: " + err)
  }
})

router.route("/:projectId").get(async (req, res) => {
  try {
    const project = await Project.find({ _id: req.params.projectId })
    res.status(200).json({ project })

  }
  catch (err) {
    res.status(500).json("Error: " + err)
  };
})


//ADD MIDDLEWARE (CHECK-AUTH) WHERE IT NEEDS (PRIVATE FUNCTION)
//CHECK LOGIN WHEN YOU WORK WITH PROJECT 

//ADD NEW PROJECT



router.post("/addproject", verify, async (req, res) => {
  try {
    const newproject = new Project({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      status: req.body.status,
      stack: req.body.stack,
      price: req.body.price,
      description: req.body.description
    })
    const savedProject = await newproject.save()
    //res.status(201).json({ message: "Created project successfully" })
    //const info = await Project.find()
    res.json(newproject)

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

router.patch("/:projectId", async (req, res, next) => {
  try {
    const id = req.params.projectId;

    const result = await Project.update({ _id: id }, { $set: req.body })
    res.status(200).json("Project updates")
  } catch (err) {
    res.status(500).json("Error: " + err)
  };
})


module.exports = router;