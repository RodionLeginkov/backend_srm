const router = require("express").Router();
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const { registerValidation, loginValidation } = require("./validation")
let User = require("../models/users.model");



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
router.route("/").get(async (req, res) => {
  try {
    const info = await User.find()
    res.json(info)
  }

  catch (err) {
    res.status(400).json("Error: " + err)
  }
});


/////////////////////////////////////////////////////////////////
router.post("/update/:usersId", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.usersId);
    user.login = req.body.login;
    user.skype = req.body.skype;
    user.github = req.body.github;
    user.phoneNumber = Number(req.body.phoneNumber);
    user.currentProject = req.body.currentProject

    const savedUser = await user.save()
    res.json("Information updated!");
  }
  catch (err) {
    res.status(400).json("Error: " + err)

  }
})


module.exports = router;
