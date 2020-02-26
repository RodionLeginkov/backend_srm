const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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



/*router.route("/addproject").post((req, res) => {
  try {

    const name = req.body.name;
    const statys = req.body.statys;
    const workers = Number(req.body.workers);
    const salaries = req.body.salaries;

    const newExercise = new Exercise({
      username,
      description,
      duration,
      date
    });

    newExercise
      .save()
      .then(() => res.json("Exercise added!"))
  } catch (err => res.status(400).json("Error: " + err));
});
*/

//DELETE PROJECT



//CHANGE PROJECT 
module.exports = router;