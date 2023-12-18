const { validationResult } = require("express-validator");

const HttpError = require("../Models/http-error");
const Detail = require("../Models/Details");

const createDetails = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed. Please check the data.", 422)
    );
  }

  const { schoolName,mission, vision,phoneNumber,mail,address, description, awards, classes, studentNumber,classNumber } =
    req.body;

  try {
    const existingDetails = await Detail.findOne();
    if (existingDetails) {
      return next(
        new HttpError(
          "The details already exist. You can update the details instead of creating them.",
          409
        )
      );
    }

    const createdDetails = new Detail({
      schoolName,
      mission,
      vision,
      phoneNumber,
      mail,
      address,
      description,
      awards,
      classes,
      classNumber,
      studentNumber,
      image:req.file.path
    });

    await createdDetails.save();

    res
      .status(201)
      .json({ Details: createdDetails });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong while creating details. Please try again.",
      500
    );
    return next(error);
  }
};
const getDetails = async (req, res, next) => {
  let details;
  try {
    details = await Detail.find().lean();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not fetch details, please try again",
      500
    );
    return next(error);
  }
  
  res.json({ details: details });
};
const getLogo = async (req, res, next) => {
  let details;
  try {
    details = await Detail.find().lean();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not fetch details, please try again",
      500
    );
    return next(error);
  }
  const imageUrls = details.map(detail => detail.image);
  const image=imageUrls[0]
  
  res.json({ image });
};
const getDetailsOne = async (req, res, next) => {
  let details;
  try {
    details = await Detail.find().lean();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not fetch details, please try again",
      500
    );
    return next(error);
  }
  res.json({ details: details });
};
const updateDetails = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again", 422));
  }
  const { schoolName,mission, vision,phoneNumber,mail,address, description,classNumber, awards, classes, studentNumber } =
    req.body;

  try {
    let existingDetails;
    existingDetails = await Detail.findOne();
    if (!existingDetails) {
      const createdDetails = new Detail({
        schoolName,
        mission,
        vision,
        phoneNumber,
      mail,
      address,
        description,
        awards,
        classes,
        classNumber,
        studentNumber,
        image:req.file.path
      });
      await createdDetails.save();
    } else {
      existingDetails.schoolName = schoolName;
      existingDetails.mission = mission;
      existingDetails.vision = vision;
      existingDetails.description = description;
      existingDetails.phoneNumber = phoneNumber;
      existingDetails.mail = mail;
      existingDetails.address = address;
      existingDetails.awards = awards;
      existingDetails.classes = classes;
      existingDetails.classNumber = classNumber;
      existingDetails.studentNumber = studentNumber;
      existingDetails.image = req.file.path;

      await existingDetails.save();
    }
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Something went wrong could not update the place please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Details updated successfully" });
};

const deleteDetails = async (req, res, next) => {
  try {
    // Delete all details
    await Detail.deleteMany({});
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not delete the details, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "All details deleted successfully" });
};
exports.createDetails = createDetails;
exports.getDetails = getDetails;
exports.getLogo = getLogo;
exports.getDetailsOne = getDetailsOne;
exports.updateDetails = updateDetails;
exports.deleteDetails = deleteDetails;
