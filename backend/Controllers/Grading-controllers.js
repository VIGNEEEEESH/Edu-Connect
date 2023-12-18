const HttpError = require("../Models/http-error");
const { validationResult } = require("express-validator");
const Grading = require("../Models/Gradings");

const mongoose = require("mongoose");

const getGrades = async (req, res, next) => {
  let grades;
  try {
    grades = await Grading.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not fetch the grades, please try again ",
      500
    );
    return next(error);
  }
  res.json({ grades: grades });
};

const getGradesById = async (req, res, next) => {
  const id = req.params.id;
  let grades;
  try {
    grades = await Grading.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not fetch the grades with the given id, please try again ",
      500
    );
    return next(error);
  }
  res.json({ grades: grades });
};

const getGradesByClass = async (req, res, next) => {
  const classNumber = req.params.classNumber;
  const examName = req.params.examName;
  console.log(classNumber)
  console.log(examName)
  let grades;
  try {
    grades = await Grading.find({ classNumber: classNumber, examName: examName });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not fetch the grades with the given class number, please try again ",
      500
    );
    return next(error);
  }
  res.json({ grades: grades });
};

const getExamNamesByClass = async (req, res, next) => {
    const classNumber = req.params.classNumber;
    let examNames;
    try {
      const grades = await Grading.find({ classNumber: classNumber });
      const examNamesSet = new Set(grades.map((grade) => grade.examName));
      examNames = Array.from(examNamesSet);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not fetch the exam names with the given class number, please try again",
        500
      );
      return next(error);
    }
    res.json({ examNames: examNames });
  };
  

const createGrades = async (req, res, next) => {
  const errors = validationResult(req);
    console.log(errors)
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please try again", 422));
  }
  const {
    student,
    studentName,
    rollNumber,
    examName,
    classNumber,
    subjects,
    totalMarks,
    percentage,
  } = req.body;
  const createdGrades = new Grading({
    student,
    studentName,
    rollNumber,
    examName,
    classNumber,
    subjects,
    totalMarks,
    percentage,
  });
  try {
    await createdGrades.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not save results,please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ grades: createdGrades });
};


const createMultipleGrades = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please try again", 422));
  }

  const { gradingData } = req.body;

  if (!Array.isArray(gradingData)) {
    return next(new HttpError("Invalid data format, expected an array", 422));
  }

  try {
    // Insert the bulk grading data into the database
    const createdGrades = await Grading.insertMany(gradingData);
    res.status(201).json({ grades: createdGrades });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not save results, please try again",
      500
    );
    return next(error);
  }
};

exports.createMultipleGrades = createMultipleGrades;

exports.getGrades = getGrades;
exports.getGradesById = getGradesById;
exports.getGradesByClass = getGradesByClass;
exports.getExamNamesByClass = getExamNamesByClass; // Add the new function
exports.createGrades = createGrades;

