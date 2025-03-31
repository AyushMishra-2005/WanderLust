const express = require("express");
const User = require("../models/user.js");

//Render signup page
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// signup
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const regUser = await User.register(newUser, password);
    console.log(regUser);
    req.login(regUser, (err) => {
      if(err){
       return next(err);
      }
      req.flash("success", "Welcome to WnderLust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};


// Render login page
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};


// Login
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  return res.redirect(redirectUrl);
};



// Logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if(err){
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};




















