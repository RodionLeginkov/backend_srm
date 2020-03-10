const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const verify = require("../middleware/check-auth")
const multer = require('multer')
//const upload = multer({dest: '../uploads/'})

let User = require("../models/users.model");
let Project = require("../models/project.model")

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



//router.post("/addproject", verify, async (req, res) => {
router.route("/",verify).get(async (req, res) => {
//router.get("/", verify,async(req, res) => {
  try {
    //const { userId } = res.locals;
    // const user = await User.findById(userId);
    //if (!user.isAdmin) throw 'not admin'
    const info = await Project.find()
    res.json(info)
  }
  catch (err) {
    res.status(400).json("Error: " + err)
  }
})


router.route("/:projectId",verify).get(async (req, res) => {
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



router.post("/addproject", upload.single("projectImage") ,async (req, res) => {
  try {
    console.log(req.file); 
    if( req.file === undefined){
      console.log(req.body)
      const newproject = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        status: req.body.status,
        stack: req.body.stack,
        price: req.body.price,
        duration: req.body.duration,
        description: req.body.description
      })
      const { userId } = res.locals;
      const user = await User.findById(userId);
      //if (!user.isAdmin) throw 'not admin'
      const savedProject = await newproject.save()
      res.json(newproject)
    }else{
      const newproject = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        status: req.body.status,
        stack: req.body.stack,
        price: req.body.price,
        duration: req.body.duration,
        description: req.body.description,
        projectImage: req.file.path
      })
      const { userId } = res.locals;
      const user = await User.findById(userId);
      //if (!user.isAdmin) throw 'not admin'
      const savedProject = await newproject.save()
      res.json(newproject)
    }


    

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

router.patch("/:projectId",upload.single("projectImage"), async (req, res, next) => {
  try {
    const id = req.params.projectId;

    const result = await Project.update({ _id: id }, { $set: req.body })
    const project = await Project.find({_id: req.params.projectId})
    res.status(200).json(project)
  } catch (err) {
    res.status(500).json("Error: " + err)
  };
})


module.exports = router;