const express = require("express");
const router = express.Router();
const UserModel = require("../Model/Auth");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const jwt_secret = "ICECUBE";
const middleware = require("../Middleware/Middleware");
router.post(
  "/Signup",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const { name, email, password,image } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const emailErrors = errors.array({
        onlyErrors: true,
        attributeFilter: "email",
      });
      const passwordErrors = errors.array({
        onlyErrors: true,
        attributeFilter: "password",
      });
      const nameErrors = errors.array({
        onlyErrors: true,
        attributeFilter: "name",
      });
      if (emailErrors.length > 0 && passwordErrors.length > 0) {
        return res.status(422).json({ emailErrors, passwordErrors });
      } else if (emailErrors.length > 0) {
        return res.status(405).json({ emailErrors });
      } else if (passwordErrors.length > 0) {
        return res.status(401).json({ passwordErrors });
      } else if (nameErrors.length > 0) {
        return res.status(403).json({ nameErrors });
      }
    }
    try {
      const already_exist = await UserModel.findOne({ Email: email });
      const User_replica = await UserModel.findOne({ UserName: name });
      if (already_exist) {
        res.status(404).json({ error: "User already exists" });
      } else {
        if (User_replica) {
          res.status(404).json({ error: "Username is already taken" });
        } else {
          const salt = await bcrypt.genSalt(10);
          const parsedPass = await bcrypt.hash(password, salt);
          const Saving = await UserModel.create({
            Email: email,
            Password: parsedPass,
            UserName: name,
            Image:image
          });
          res.send(Saving);
        }
      }
    } catch (error) {
      res.status(404).json({ error:"Internal server occured" });
    }
  }
);
router.post("/Signin", async (req, res) => {
  const { email, password } = req.body;
  const User_auth = await UserModel.findOne({ Email: email });
  if (!User_auth) {
    res.status(402).json({ error: "Invald credetials" });
  } else {
    const valid = await bcrypt.compare(password, User_auth.Password);
    if (valid) {
      const User = {
        User_Id: {
          ID: User_auth.id,
        },
      };
      const Token = await jwt.sign(User, jwt_secret);
      res.json(Token);
    } else {
      res.status(404).json({ error: "invalid credidential" });
    }
  }
});
router.get("/Get", middleware, async (req, res) => {
  const User_id = req.user.ID;
  const User_details = await UserModel.findById(User_id);
  res.send(User_details);
});
router.post("/likes/:id", middleware, async (req, res) => {
  const user_ID = req.user.ID;
  const Blog_id = req.params.id;
  const { option } = req.body;
  const userData = await UserModel.findOne({ _id: user_ID });
  if (!userData) {
    return res.status(404).send("User not found");
  } else {
    if (option) {
      if (userData.Liked.includes(Blog_id)) {
        return res.status(400).json({ message: "id already exist " });
      }
      else{
        try {
              const updating_Likes = await UserModel.findOneAndUpdate(
                { _id: user_ID },
                { $push: { Liked: Blog_id } },
                { new: true }
              );
            } catch (error) {
              res.send.json(error);
            }
      }
      }
      if (!option) {
          try {
            const updating_Likes = await UserModel.findOneAndUpdate(
              { _id: user_ID },
              { $pull: { Liked: Blog_id } },
              { new: true }
            );
          } catch (error) {
            res.send.json(error);
          }
    }
  }
});

module.exports = router;
