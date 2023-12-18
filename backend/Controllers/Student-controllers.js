const HttpError = require("../Models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Student = require("../Models/Students");

const createStudent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
      throw new HttpError("Invalid inputs passed, please check your data", 422);
    }

    const {
      studentName,
      fatherName,
      motherName,
      classNumber,
      caste,
      progress,
      motherTongue,
      bloodGroup,
      fatherNumber,
      motherNumber,
      fatherOccupation,
      motherOccupation,
      rollNumber,
      studentId
    } = req.body;

    const createdStudent = new Student({
      studentName,
      fatherName,
      motherName,
      classNumber,
      caste,
      progress,
      motherTongue,
      bloodGroup,
      fatherNumber,
      motherNumber,
      fatherOccupation,
      motherOccupation,
      rollNumber,
      studentId
    });

    await createdStudent.save();
    console.log(createStudent);
    res.status(201).json({ students:createdStudent });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not create a student, try with new student",
      500
    );
    return next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  let students;
  try {
    students = await Student.find({}).maxTimeMS(300000);
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "something went wrong, could not fetch students, please try again",
      500
    );
    
    return next(error);
  }
  res.json({ students: students });
};
const getStudentByName = async (req, res, next) => {
  const name = req.params.studentName;
  let students;
  try {
    students = await Student.findMany({ name: name });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find students, please try again",
      500
    );
    return next(error);
  }
  if (!name) {
    const error = new HttpError(
      " could not find student with the given name, please try again",
      404
    );
    return next(error);
  }
  res.json({ students: students });
};
const getStudentsByClass = async (req, res, next) => {
  const classNumber = req.params.classNumber;
  let students;
  try {
    students = await Student.find( {classNumber:classNumber} );
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Something went wrong, could not find students, please try again",
      500
    );
    return next(error);
  }
  if (!classNumber) {
    console.log(err)

    const error = new HttpError(
      " could not find students with the given class, please try again",
      404
    );
    return next(error);
  }
  res.json({ students: students });
};

const getStudentByStudentId = async (req, res, next) => {
  const studentId = req.params.studentId;
  let students;
  try {
    students = await Student.find({ studentId: studentId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find student, please try again",
      500
    );
    return next(error);
  }
  if (!studentId) {
    const error = new HttpError(
      " could not find student with the given student id, please try again",
      404
    );
    return next(error);
  }
  res.json({ students: students });
};
const getStudentById = async (req, res, next) => {
  const id = req.params.id;
  let student;
  try {
    student = await Student.findOne({ _id:id});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find student, please try again",
      500
    );
    return next(error);
  }
  if (!id) {
    const error = new HttpError(
      " could not find student with the given student id, please try again",
      404
    );
    return next(error);
  }
  res.json({ student: student });
};

const updateStudentById = async (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again"));
  }
  const {
    studentName,
      fatherName,
      motherName,
      classNumber,
      caste,
      progress,
      motherTongue,
      bloodGroup,
      fatherNumber,
      motherNumber,
      fatherOccupation,
      motherOccupation,
      rollNumber,
      
  } = req.body;
  const id = req.params.id;
  let student
  try{
    student=await Student.findOne({_id:id})
  }catch(err){
    const error=new HttpError(
      "something went wrong, could not find the student, please try again.",500
    )
    return next(error)
  }
  student.studentName=studentName,
  student.fatherName=fatherName,
  student.motherName=motherName,
  student.classNumber=classNumber,
  student.caste=caste,
  student.progress=progress,
  student.motherTongue=motherTongue,
  student.bloodGroup=bloodGroup,
  student.fatherNumber=fatherNumber,
  student.motherNumber=motherNumber,
  student.fatherOccupation=fatherOccupation,
  student.motherOccupation=motherOccupation,
  student.rollNumber=rollNumber


  try{
    await student.save()
  }catch (err) {
    console.log(err)
    const error = new HttpError(
      
      "something went wrong, Could not update the student, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({ student: student });
};

const deleteStudentById=async(req,res,next)=>{
  const id=req.params.id
  let student
  try{
    student=await Student.findOne({_id:id})
  }catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the student, please try again",
      500
    );
    return next(error);
  }
  if(!student){
    const error=new HttpError("Student not found, please try again",500)
    return next(error)
  }
  try{
    await student.deleteOne()
  }catch (err) {
    
    const error = new HttpError(
      "something went wrong, could not delete the student, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "The student Successfully deleted" }); 
}
exports.createStudent = createStudent;
exports.getAllStudents = getAllStudents;
exports.getStudentByName = getStudentByName;
exports.getStudentsByClass = getStudentsByClass;
exports.getStudentByStudentId = getStudentByStudentId;
exports.getStudentById = getStudentById;
exports.updateStudentById = updateStudentById;
exports.deleteStudentById = deleteStudentById;



