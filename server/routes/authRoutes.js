const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwt = require("jsonwebtoken");



router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);



router.get(
  "/google/callback",

  passport.authenticate("google", {
    session:false,
    failureRedirect:"/"
  }),

  (req,res)=>{


    const token = jwt.sign(
      {
        id:req.user._id,
        role:req.user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn:"7d"
      }
    );


    res.redirect(
      `http://localhost:5173/auth-success?token=${token}`
    );


  }

);


module.exports = router;