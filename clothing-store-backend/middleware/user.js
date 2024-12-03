const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization"); 
  if (!authHeader) return res.status(401).send("Access denied. No token provided.");

  const token = authHeader.replace("Bearer ", ""); 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};
