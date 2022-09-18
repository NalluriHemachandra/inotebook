const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "HCIsLearningReact";

const fetchuser = (req, res, next) => {
  //get the user from jwt token and add id to the object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({
      error: "something went wrong, please re-login into the application",
    });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({
      error: "something went wrong, please re-login into the application",
    });
  }
};

module.exports = fetchuser;
