const HttpError = require("../Models/http-error");
const { validationResult } = require("express-validator");
const Teacher = require("../Models/Teachers");
const fs=require("fs")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createTeacher = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(new HttpError("Invalid inputs passed, please try again", 422));

  }

  const { name, email,qualification,subjects, password } = req.body;
  let existingTeacher;
  try {
    existingTeacher = await Teacher.findOne({ email: email });
  } catch (err) {
    console.log(err)
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  if (existingTeacher) {

    const error = new HttpError(
      "Email already exists, please try loggin in",
      422
    );
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create the user, please try again",
      500
    );
    return error;
  }

  const createdTeacher = new Teacher({
    name,
    email,
    password:hashedPassword,
    image:req.file.path,
    qualification,
    subjects
  });

  try {
    await createdTeacher.save();
  }catch (err) {console.log(err)

    const error = new HttpError(
      "Something went wrong, could not create teacher, please try again",
      500
    );
    return next(error);
  }
  let token;
  try{
    token = jwt.sign(
      { userId: createdTeacher.id, email: createdTeacher.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

  }catch(err){
    const error = new HttpError(
      "something went wrong, signing up failed,please try again",
      500
    );
    return next(error)
  }
 

  res.status(201).json({ userId: createdTeacher.id,email:createdTeacher.email,token:token });

};
const getTeachers = async (req, res, next) => {
  let teachers;
  try {
    teachers = await Teacher.find({}, "-password").lean();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find teachers, please try again",
      500
    );
    return next(error);
  }
  res.json({ teachers: teachers });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingTeachers;

  try {
    existingTeachers =await Teacher.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  if (!existingTeachers) {
    const error = new HttpError("Invalid crudentials, please try again", 401);
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingTeachers.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your crudentials and try again",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError("Invalid crudentials, please try again", 401);
    return next(error);
  }

  let token
  try{
    
    token =jwt.sign({
      userId:existingTeachers.id, email:existingTeachers.email},process.env.JWT_KEY,{expiresIn:"1h"})
  }catch(err){
    console.log(err)
    const error = new HttpError(
      "something went wrong, logging in failed, please try again",
      500
    );
    return next(error)
  }

  res.json({userId: existingTeachers.id, email:existingTeachers.email,token:token });
};
const getTeacherByEmail=async(req,res,next)=>{
    const email=req.params.email
    let teacher
    try{
        teacher=await Teacher.findOne({email:email})
    }catch(err){
        console.log(err)
        const error = new HttpError("Something went wrong, could not find the teacher", 500);
    return next(error)
    }
    if(!teacher){
        const error = new HttpError("Could not find the teacher with the given email", 500);
    return next(error)
    }
    res.json({teacher:teacher})
}

const updateTeacher=async(req,res,next)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again", 422));
  }
    const email=req.params.email
    const{name,password,image,qualification,subjects}=req.body
    let teacher
    try{
        teacher=await Teacher.findOne({email:email})
        if(teacher){
            teacher.name=name,
            teacher.password=password,
            teacher.image=req.file.path
            teacher.qualification=qualification,
            teacher.subjects=subjects
            await teacher.save()
        }
    }catch(err){
        console.log(err)
        const error = new HttpError("Something went wrong, could not find the teacher or could not update the teacher, please try again", 500);
    return next(error)
    }
    res.status(201).json(({teacher:teacher}))

}
const deleteTeacher=async(req,res,next)=>{
    const email=req.params.email
    let teacher
    try{
        teacher=await Teacher.findOne({email:email})
    }catch(err){
        console.log(err)
        const error = new HttpError("Something went wrong, could not find the teacher , please try again", 500);
    return next(error)
    }
    if(!teacher){
      return next(new HttpError("teacher not found"))
  }
  const imagePath=teacher.image
  try{
    await teacher.deleteOne()
  }catch(err){
    const error = new HttpError(
      "something went wrong, could not delete the teacher, please try again",
      500
    );
    return next(error);
  }

    fs.unlink(imagePath,(err)=>{
      console.log(err)
    })
    res.status(200).json({message:"teacher successfully deleted"})
    
}
exports.createTeacher = createTeacher;
exports.getTeachers = getTeachers;
exports.login=login
exports.getTeacherByEmail=getTeacherByEmail
exports.updateTeacher=updateTeacher
exports.deleteTeacher=deleteTeacher
