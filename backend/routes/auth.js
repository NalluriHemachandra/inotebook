const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "HCIsLearningReact";
var fetchuser = require("../middleware/fetchuser")

// ROUTE 1 : Create user using POST : "/api/auth/singup". Doesn't require auth
router.post(
  "/signup",
  [
    body("email", "Please enter valid email").isEmail(),
    body("name", "Please enter valid name").isLength({ min: 3 }),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email alreadt exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
      // user = await User.create({
      //     name: req.body.name,
      //     email:req.body.email,
      //     password: securePassword,
      //   }).then(user => res.json(user))
      //   .catch(e => {console.log(e)
      //   res.json({error : 'Email already exists',message : e.message})});

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET_KEY);

      res.json(authToken);
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  }
);

//ROUTE2 : Authenticate a user using POST : "/api/auth/signin"

router.post(
  "/signin",
  [
    body("email", "Please enter valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "please enter valid email/password" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "please enter valid email/password" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(payload, JWT_SECRET_KEY);

      res.json(authToken);
    } catch (error) {
      res.status(500).send("something went wrong");
    }
  }
);

// ROUTE 3 :  Get loggedin user details using POST : "/api/auth/get"
router.post(
  "/getuser",fetchuser,
  async (req, res) => {
    try {
      let userId = req.user.id;
      const user =await User.findById(userId).select("-password");
      res.send(user);
      console.log(user);
    } catch (error) {
      res.status(500).send("something went wrong");
    }
  }
);

module.exports = router;
