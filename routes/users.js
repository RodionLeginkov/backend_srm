const router = require("express").Router();
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

let User = require("../models/users.model");

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


/////////////////////////////////////////////////////////////////////////////
router.post("/login", async (req, res, next) => {
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
})

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
  //console.log('REQ', req.params.userId)
  try {
    const user = await User.findById(req.params.usersId);
    console.log('USER', user)
    user.login = req.body.login;
    user.skype = req.body.skype;
    user.github = req.body.github;
    user.phoneNumber = Number(req.body.phoneNumber);
    user.project = req.body.project

    const savedUser = await user.save()
    res.json("Information updated!");
  }
  catch (err) {
    res.status(400).json("Error: " + err)

  }
})


module.exports = router;
