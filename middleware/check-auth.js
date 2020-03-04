const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.body.headers.tokens;
   console.log(req.body.headers.tokens)
   console.log("hello")
  
  if (!token){ 
    return res.status(401).send("Access Denied")};
  try {
   // console.log("TEST")
    // console.log(token)
    // console.log(process.env.TOKEN_SECRET)
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    //console.log(verified)
    req.user = verified;
    //console.log("SUCCESS")
    next();
  } catch (err) {
    res.status(402).send("Invalid Token")
  }
}