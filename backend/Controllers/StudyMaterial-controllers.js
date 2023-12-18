const { validationResult } = require("express-validator");
const StudyMaterial = require("../Models/StudyMaterial");
const HttpError = require("../Models/http-error");
const fs=require("fs")

const addFile = async (req, res, next) => {
    const classNumber=req.params.classNumber
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again", 422));
  }

  const file = req.file.path;
  const {fileName}=req.body
  const addedFile = new StudyMaterial({
    file: file,
    fileName:fileName,
    classNumber:classNumber
  });

  try {
    await addedFile.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, adding file failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ file: addedFile });
};

// Controller for fetching all files
const getFiles = async (req, res, next) => {
  let files;
  try {
    files = await StudyMaterial.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, fetching files failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({ files: files });
};
const getFilesByClassNumber = async (req, res, next) => {
  const classNumber=req.params.classNumber
  let files;
  try {
    files = await StudyMaterial.find({classNumber:classNumber});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, fetching files failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({ files: files });
};

// Controller for deleting a file by ID
const deleteFileById = async (req, res, next) => {
  const fileId = req.params.id;

  let file;
  try {
    file = await StudyMaterial.findById(fileId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the file, please try again",
      500
    );
    return next(error);
  }

  if (!file) {
    const error = new HttpError("File not found, please try again", 500);
    return next(error);
  }
  const filePath=file.file
  try {
    await file.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the file, please try again",
      500
    );
    return next(error);
  } fs.unlink(filePath,(err)=>{
    console.log(err)
  })

  res.status(200).json({ message: "The file was successfully deleted" });
};

module.exports = {
  addFile,
  getFiles,
  getFilesByClassNumber,
  deleteFileById,

};
