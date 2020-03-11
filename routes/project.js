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




// Routes
/**
* @swagger
* /project:
*  get:
*    tags:
*    - Project
*    description: Use to request all projects 
*    summary: "Get all project in system"       
*    responses:
*      '200':
*        description: return new project
*        schema:
*          type: "object"
*          properties: 
*            id:
*              type: integer
*            name:
*              type: string
*            status:
*              type: string
*            stack:
*              type: array
*              items:
*                 type: string
*            price:
*              type: integer
*            duration:
*              type: string 
*            description:
*              type: string
*            projectImage:
*              type: string
*/


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



/**
* @swagger
* /project/{projectId}:
*  get:
*    tags:
*    - Project
*    summary: "Find project by ID"
*    description: "Returns a single project"         
*    produces:
*    - "applicaton/xml"
*    - "application/json"
*    parameters:
*    - name: "projectId"
*      in: "path"
*      description: "ID of project to return"
*      required: true
*    responses:
*      200:
*        description: "successfull operation"
*        schema:
*          type: "object"
*          properties: 
*            id:
*              type: integer
*            name:
*              type: string
*            status:
*              type: string
*            stack:
*              type: array
*              items:
*                 type: string
*            price:
*              type: integer
*            duration:
*              type: string 
*            description:
*              type: string
*            projectImage:
*              type: string
*/

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


/**
* @swagger
* /project/addproject:
*  post:
*    tags:
*    - Project
*    summary: "Updates a project"
*    description: "Returns a changed project"         
*    produces:
*    - "applicaton/xml"
*    - "application/json"
*    parameters:
*    - name: "projectId"
*      in: "path"
*      description: "ID of project to return"
*      required: true
*    - name: "name"
*      in: "fromData"
*      description: "Updated name of the project"
*      required: false
*      type: "string"
*    - name: "duration"
*      in: "fromData"
*      description: "Updated duration of the project"
*      required: false
*      type: "string"
*    - name: "description"
*      in: "fromData"
*      description: "Updated description of the project"
*      required: false
*      type: "string"
*    - name: "price"
*      in: "fromData"
*      description: "Updated price of the project"
*      required: false
*      type: "integer"
*    responses:
*      200:
*        description: "successfull operation"
*        schema:
*          type: "object"
*          properties: 
*            id:
*              type: integer
*            name:
*              type: string
*            status:
*              type: string
*            stack:
*              type: array
*              items:
*                 type: string
*            price:
*              type: integer
*            duration:
*              type: string 
*            description:
*              type: string
*            projectImage:
*              type: string
*/

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
        description: req.body.description,
        developers: req.body.developers
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
        projectImage: req.file.path,
        developers: req.body.developers
      })
      const { userId } = res.locals;
      const user = await User.findById(userId);
      //if (!user.isAdmin) throw 'not admin'
      const savedProject = await newproject.save()
      res.json(newproject)
    }


    

  } catch (err) { res.status(400).json("Error: " + err) };
});


/**
* @swagger
* /project/{projectId}:
*  delete:
*   tags:
*   - Project
*   summary: "Deletes a project"
*   produces:
*   - "application/xml"
*   - "application/json"
*   parameters:
*   - name: "projectId"
*     in: "path"
*     description: "Project id to delete"
*     required: true    
*   responses:
*      '200':
*        description: A successful response
*/
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

/**
* @swagger
* /project/{projectId}:
*  patch:
*    tags:
*    - Project
*    summary: "Updates a project"
*    description: "Returns a changed project"         
*    produces:
*    - "applicaton/xml"
*    - "application/json"
*    parameters:
*    - name: "projectId"
*      in: "path"
*      description: "ID of project to return"
*      required: true
*    - name: "name"
*      in: "fromData"
*      description: "Updated name of the project"
*      required: false
*      type: "string"
*    - name: "duration"
*      in: "fromData"
*      description: "Updated duration of the project"
*      required: false
*      type: "string"
*    - name: "description"
*      in: "fromData"
*      description: "Updated description of the project"
*      required: false
*      type: "string"
*    - name: "price"
*      in: "fromData"
*      description: "Updated price of the project"
*      required: false
*      type: "integer"
*    responses:
*      200:
*        description: "successfull operation"
*        schema:
*          type: "object"
*          properties: 
*            id:
*              type: integer
*            name:
*              type: string
*            status:
*              type: string
*            stack:
*              type: array
*              items:
*                 type: string
*            price:
*              type: integer
*            duration:
*              type: string 
*            description:
*              type: string
*            projectImage:
*              type: string
*/


//CHANGE PROJECT 

router.patch("/:projectId", async (req, res, next) => {
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