const router = require("express").Router();
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const verify = require("../middleware/check-auth")
const { registerValidation, loginValidation } = require("./validation")
const sgMail = require('@sendgrid/mail')
const multer = require('multer')
const aws = require("aws-sdk")
const crypto = require("crypto");
const nodemailer = require("nodemailer");
//import crypto from 'crypto';
let User = require("../models/users.model");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage})


/*

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
});*/


/**
* @swagger
* /users/signup:
*  post:
*    description: Use to create new user         
*    responses:
*      '200':
*        description: A successful response
*/

/**
* @swagger
* /users/signup:
*  post:
*   tags:
*   - User
*   summary: "Signup user into the system"
*   produces:
*   - "application/xml"
*   - "application/json"
*   parameters:
*   - name: "login"
*     in: "fromData"
*     description: "The user login"
*     required: true 
*   - name: "password"
*     in: "fromData"
*     description: "The password for login"
*     required: true    
*   responses:
*      '200':
*        description: A successful response
*/
router.post("/signup", async (req, res, next) => {
  try {
    //const { error } = registerValidation(req.body)
    //if (error) return res.status(400).send(error.details[0].message)
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
      fullName: req.body.fullName,
      login: req.body.email.split("@")[0]
    })
    try {
      const savedUser = await user.save();
      res.send({ user: user});
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
*   tags:
*   - User
*   summary: "Logs user into the system"
*   produces:
*   - "application/xml"
*   - "application/json"
*   parameters:
*   - name: "login"
*     in: "fromData"
*     description: "The user login"
*     required: true 
*   - name: "password"
*     in: "fromData"
*     description: "The password for login"
*     required: true    
*   responses:
*      '200':
*        description: A successful response
*/
router.post("/login", async (req, res) => {
  //console.log(req.body.email);
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send({message:"Something is wrong"});

  //cheking if the email exists
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send({message:"Email or password is wrong"});

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send({message: "Password is wrong"});

  //Create and assign a token
  //console.log(user.id)
  const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
  //console.log("Token", token)
  //await user.update({token: token});
  //console.log("USER", user)
  //console.log(user)
  res.send({user,token})
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

//router.route("/",verify).get(async (req, res) => {
router.get("/",verify, async(req,res) =>{
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
//router.route("/:usersId").get(async (req, res) => {
router.get('/:usersId', async (req,res) => {  
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
* /users/update/{usersId}:
*  post:
*    tags:
*    - User
*    summary: "Updates a users"
*    description: "Returns a changed users"         
*    produces:
*    - "applicaton/xml"
*    - "application/json"
*    parameters:
*    - name: "usersId"
*      in: "path"
*      description: "ID of user to return"
*      required: true
*    - name: "login"
*      in: "fromData"
*      description: "Updated login of the project"
*      required: false
*      type: "string"
*    - name: "skype"
*      in: "fromData"
*      description: "Updated skype of the project"
*      required: false
*      type: "string"
*    - name: "currentProject"
*      in: "fromData"
*      description: "Updated currentProject of the project"
*      required: false
*      type: "string"
*    - name: "phoneNumber"
*      in: "fromData"
*      description: "Updated phoneNumber of the project"
*      required: false
*      type: "integer"
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
/////////////////////////////////////////////////////////////////
router.post("/update/:usersId", upload.single("userImage"), async (req, res, next) => {
  try {
    if (req.file === undefined){
      const user = await User.findById(req.params.usersId);
      user.login = req.body.login;
      user.fullName = req.body.fullName;
      user.role = req.body.role;
      user.englishLevel = req.body.englishLevel;
      user.dataofJoining = req.body.dataofJoining;
      user.dataofLeave = req.body.dataofLeave;
      user.skype = req.body.skype;
      user.github = req.body.github;
      user.phoneNumber = req.body.phoneNumber;
      user.mainTask = req.body.mainTask
      user.currentProject = req.body.currentProject;
      user.stack = req.body.stack;
      user.skillset= req.body.skillset;
      user.comment = req.body.comment;
      user.status = req.body.status;

      const savedUser = await user.save()
      const newUser = await User.find({_id: req.params.usersId})
      res.status(200).json(newUser);
    }else{
      const file = req.file;
      const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK

      let s3bucket = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      })

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
      };
      s3bucket.upload(params, async(err,data) =>{
        if (err) res.status(500).json({ error: true, Message: err });
        else{
          console.log(data.Location)
          const user = await User.findById(req.params.usersId);
          user.login = req.body.login;
          user.fullName = req.body.fullName;
          user.role = req.body.role;
          user.englishLevel = req.body.englishLevel;
          user.dataofJoining = req.body.dataofJoining;
          user.dataofLeave = req.body.dataofLeave;
          user.skype = req.body.skype;
          user.github = req.body.github;
          user.phoneNumber = req.body.phoneNumber;
          user.mainTask = req.body.mainTask
          user.currentProject = req.body.currentProject;
          user.stack = req.body.stack;
          user.skillset= req.body.skillset;
          user.comment = req.body.comment;
          user.userImage = data.Location;
          const savedUser = await user.save()
          const newUser = await User.find({_id: req.params.usersId})
          res.status(200).json(newUser);
    }
  })}}
  catch (err) {
    res.status(400).json("Error: " + err)

  }
})


/**
* @swagger
* /users/{usersId}:
*  patch:
*    tags:
*    - User
*    summary: "Updates a users"
*    description: "Returns a changed users"         
*    produces:
*    - "applicaton/xml"
*    - "application/json"
*    parameters:
*    - name: "usersId"
*      in: "path"
*      description: "ID of user to return"
*      required: true
*    - name: "login"
*      in: "fromData"
*      description: "Updated login of the project"
*      required: false
*      type: "string"
*    - name: "skype"
*      in: "fromData"
*      description: "Updated skype of the project"
*      required: false
*      type: "string"
*    - name: "currentProject"
*      in: "fromData"
*      description: "Updated currentProject of the project"
*      required: false
*      type: "string"
*    - name: "phoneNumber"
*      in: "fromData"
*      description: "Updated phoneNumber of the project"
*      required: false
*      type: "integer"
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


router.post("/forgotPassword", async (req,res) =>{
  //console.log(req.body)
  try{
  if (req.body.email === "") res.status(400).send('email required');
  //console.error(req.body.email);
  const user = await User.findOne({
    email:req.body.email
  });
  
  if (user === null ){
    console.error('email not in database');
    res.status(403).send('email not in db')
  }else {
    const token = crypto.randomBytes(20).toString('hex');
    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
      
    });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      }
    })
    console.log(user)
    const mailOptions = {
      from: 'rodion.leginkov@gmail.com',
      to: `${user.email}`,
      subject: 'Link to Reset Password',
      text:
      'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
      + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
      + `https://black-list-frontend.herokuapp.com/reset/${token}\n\n`
      + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    }

    //console.log('sending mail');

    transporter.sendMail(mailOptions, (err, response) =>{
      if (err) console.error('there was an error: ', err);
      else{
        console.log('here is the res: ', response);
        res.status(200).json('recovery email sent')
      }
    })
  }
  }   catch (err) {
    res.status(400).send(err);
  }
})

router.get('/reset', async(req,res,next) =>{

      //console.log(req)
     // console.log("heeeeeeeelllllllllllooooooooooooo")
    const user = await User.findOne({resetPasswordToken:req.query.resetPasswordToken})
    try{
    if (user === null){
      console.log('password reset link is invalid or nas expired')
      res.json('password reset link is invalid or nas expired ')
    }else{
      res.status(200).send({
        login: user.login,
        message: 'password reset link a-ok'
      })
    }
  }
  catch (err) {
    res.status(500).json("Error: " + err)
  };
})


router.put('/updatePasswordViaEmail', async(req,res,next) =>{
  try{
    //console.log(req.body.resetPasswordToken)
  const user = await User.findOne({resetPasswordToken:req.body.resetPasswordToken})
  //console.log(user)
  console.log(req.body.password.length)
  if (req.body.password.length < 6) return res.status(400).send('password is wrong');
  if (user != null){
    console.log("user exists in db");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    })
    
    // console.log(user.login)
    // console.log('password updated')
    res.status(200).send({message: 'password updated'})
  }
  else{
    console.log('no user exists in db to update');
    res.status(404).json('no user exists in db to update')
  }}catch (err) {
  res.status(500).json("Error: " + err)
};
})