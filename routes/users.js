const router = require("express").Router();
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const { registerValidation, loginValidation } = require("./validation")
const sgMail = require('@sendgrid/mail')
const multer = require('multer')
let User = require("../models/users.model");

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


/**
* @swagger
* /users/signup:
*  post:
*    description: Use to create new user         
*    responses:
*      '200':
*        description: A successful response
*/

router.post("/signup", async (req, res, next) => {
  try {
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //cheking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send("Email already exists");

    //const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //create a new user
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hashedPassword,
      login: "hello",
      login: req.body.email.split("@")[0]
    })
    try {
      const savedUser = await user.save();
      res.send({ user: user._id });
    }
    catch (err) {
      res.status(400).send(err);
    }
  }
  catch (error) {
    res.status(400).send(error)
  }
})

/**
* @swagger
* /users/login:
*  post:
*    description: Use to login user         
*    responses:
*      '200':
*        description: A successful response
*/

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  //cheking if the email exists
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send("Email or password is wrong");

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Password is wrong");


  //Create and assign a token
  const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
  res.send(token)
})

///////////////////////////////////////////////////////
// router.post("/forget", async (req,res) =>{
//   const { error } = loginValidation(req.body)
//   if (error) return res.status(400).send(error.details[0].message);

//   //cheking if the email exists
//   const user = await User.findOne({ email: req.body.email })
//   if (!user) return res.status(400).send("Email or password is wrong");



// })










/*
//ADD MIDDLEWARE (CHECK-AUTH) WHERE IT NEEDS (PRIVATE FUNCTION)
router.post("/signup", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.find({ email: email })


    if (user.length >= 1) {
      return res.status(409).json({
        message: "Mail exists"
      })
    }
    else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: email,
            password: hash,
          });
          const result = user.save();
          res.status(201).json({
            message: "User created"
          });
        }
      }
      )
    }

  }
  catch (err) {
    res.status(500).json("Error: " + err)
  };
})
*/

/////////////////////////////////////////////////////////////////////////////
/*router.post("/login", async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email })

    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }

    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h"
          }
        );
        return res.status(200).json({
          message: "Auth successful",
          token: token
        });
      }
      res.status(401).json({
        message: "Auth failed"
      });
    });
  }

  catch (err) {
    res.status(500).json("Error: " + err)
  };
})*/



////////////////////////////////////////////////////////////////////////

/**
* @swagger
* /users/{usersId}:
*  delete:
*   tags:
*   - User
*   summary: "Deletes a user"
*   produces:
*   - "application/xml"
*   - "application/json"
*   parameters:
*   - name: "usersId"
*     in: "path"
*     description: "user id to delete"
*     required: true    
*   responses:
*      '200':
*        description: A successful response
*/
router.delete("/:usersId", async (req, res, next) => {
  try {
    const user = await User.remove({ _id: req.params.usersId })
    res.status(200).json({ message: "User deleted" })

  }
  catch (err) {
    res.status(500).json("Error: " + err)
  };
});


///////////////////////////////////////////////////////////////
/**
* @swagger
* /users:
*  get:
*    tags:
*    - User
*    description: Use to request all users 
*    summary: "Get all users in system"       
*    responses:
*      '200':
*        description: return new users
*        schema:
*          type: "object"
*          properties: 
*            id:
*              type: integer
*            email:
*              type: string
*            login:
*              type: string
*            stack:
*              type: array
*              items:
*                 type: string
*            github:
*              type: string
*            skype:
*              type: string 
*            phoneNumber:
*              type: number
*            status:
*              type: string
*            country:
*              type: string 
*            isAdmin:
*              type: boolean
*            userImage:
*              type: string
*/

router.route("/").get(async (req, res) => {
  try {
    const info = await User.find()
    res.json(info)
  }

  catch (err) {
    res.status(400).json("Error: " + err)
  }
});

/**
* @swagger
* /users/{usersId}:
*  get:
*    tags:
*    - User
*    summary: "Find user by ID"
*    description: "Returns a single user"         
*    produces:
*    - "applicaton/xml"
*    - "application/json"
*    parameters:
*    - name: "usersId"
*      in: "path"
*      description: "ID of user to return"
*      required: true
*    responses:
*      200:
*        description: "successfull operation"
*        schema:
*          type: "object"
*          properties: 
*            id:
*              type: integer
*            email:
*              type: string
*            login:
*              type: string
*            stack:
*              type: array
*              items:
*                 type: string
*            github:
*              type: string
*            skype:
*              type: string 
*            phoneNumber:
*              type: number
*            status:
*              type: string
*            country:
*              type: string 
*            isAdmin:
*              type: boolean
*            userImage:
*              type: string
*/
router.route("/:usersId").get(async (req, res) => {
  try {
    const info = await User.find({ _id: req.params.usersId })
    res.status(200).json({ info })

  }
  catch (err) {
    res.status(500).json("Error: " + err)
  };
})

/**
* @swagger
* /users/update/userId:
*  post:
*    description: Use to add new information about user         
*    responses:
*      '200':
*        description: A successful response
*/
/////////////////////////////////////////////////////////////////
router.post("/update/:usersId", upload.single("userImage"), async (req, res, next) => {
  try {
    if (req.file.path === undefined){
      const user = await User.findById(req.params.usersId);
      user.login = req.body.login;
      user.skype = req.body.skype;
      user.github = req.body.github;
      user.phoneNumber = req.body.phoneNumber;
      user.currentProject = req.body.currentProject;
      user.stack = req.body.stack;
      user.status = req.body.status;
      user.country = req.body.country;

      const savedUser = await user.save()
      const newUser = await User.find({_id: req.params.usersId})
      res.status(200).json(newUser);
    }else{
      const user = await User.findById(req.params.usersId);
      user.login = req.body.login;
      user.skype = req.body.skype;
      user.github = req.body.github;
      user.phoneNumber = req.body.phoneNumber;
      user.currentProject = req.body.currentProject;
      user.stack = req.body.stack;
      user.status = req.body.status;
      user.country = req.body.country;
      user.userImage = req.file.path;
  
      const savedUser = await user.save()
      const newUser = await User.find({_id: req.params.usersId})
      res.status(200).json(newUser);
    }
  }
  catch (err) {
    res.status(400).json("Error: " + err)

  }
})

/**
* @swagger
* /users/userId:
*  patch:
*    description: Use to change information about user         
*    responses:
*      '200':
*        description: A successful response
*/

router.patch("/:usersId", async (req, res, next) => {
  try {
    const id = req.params.usersId;

    const result = await User.update({ _id: id }, { $set: req.body })
    const newUser = await User.find({_id: req.params.usersId})
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json("Error: " + err)
  };
})


module.exports = router;
