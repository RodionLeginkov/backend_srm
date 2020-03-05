const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.body.headers.tokens;
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