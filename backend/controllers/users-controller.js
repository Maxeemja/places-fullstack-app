const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const mongoose = require("mongoose");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (e) {
    return next(new HttpError("Fetching users failed", 500));
  }

  res.json({ users: users });
};
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.errors.length) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    return next(new HttpError("Signing up failed", 500));
  }

  if (existingUser) {
    return next(new HttpError("User already exists", 401));
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
    places: [],
  });

  try {
    await createdUser.save();
  } catch (e) {
    return next(new HttpError("Signing up failed", 500));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    return next(new HttpError("Signing up failed", 500));
  }

  if (existingUser && existingUser.password !== password) {
    return next(new HttpError("Wrong password", 401));
  }

  res.json({ message: "Logged in" });
};

module.exports = { getUsers, signup, login };
