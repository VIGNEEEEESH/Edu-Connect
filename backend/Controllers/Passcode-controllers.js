const HttpError = require("../Models/http-error");
const { validationResult } = require("express-validator");
const Passcode = require("../Models/Passcode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createPasscode = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again", 422));
  }

  const { password } = req.body; // Plain-text password
  let existingPasscode;
  try {
    existingPasscode = await Passcode.findOne();
    if (existingPasscode) {
      return next(
        new HttpError(
          "The Passcode already exists. You can update the passcode instead of creating it.",
          409
        )
      );
    }
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create the passcode, please try again",
      500
    );
    return next(error);
  }

  const createdPasscode = new Passcode({
    password: hashedPassword, // Store the hashed password in the database
  });

  try {
    await createdPasscode.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not create passcode, please try again",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { hashedPassword: hashedPassword }, // Use hashedPassword here
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

  } catch (err) {
    const error = new HttpError(
      "Something went wrong, signing up failed, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({  token: token });

};

const login = async (req, res, next) => {
  const { password } = req.body; // Plain-text password
  let existingPasscode;

  try {
    existingPasscode = await Passcode.findOne();
    if (!existingPasscode) {
      return next(new HttpError("Passcode does not exist, please create one", 404));
    }
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again",
      500
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingPasscode.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, please try again", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { hashedPassword: existingPasscode.password }, // Use the hashed password from existingPasscode
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, logging in failed, please try again",
      500
    );
    return next(error);
  }

  res.json({  token: token });
};

exports.createPasscode = createPasscode;
exports.login = login;
