const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  console.log("token add")
  //console.log(req.headers)
  console.log("Header",req.headers)
  // console.log(req.body.headers.token)
  //console.log(req.headers.token)
  //if (req.headers)
  // if (req.body.headers.token === undefined)  token = req.headers.token;
  // else if (req.headers.token === undefined)  token = req.body.headers.token;
  //onst token = req.body.headers.token;
  const token = req.headers.token;
  console.log(token)
  if (!token){ 
    return res.status(401).send("Access Denied")};
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    res.locals.userId = verified._id;
    req.user = verified;
    next();
  } catch (err) {
    res.status(402).send("Invalid Token")
  }
}