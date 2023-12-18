const HttpError = require("../Models/http-error");
const { validationResult } = require("express-validator");
const Admin = require("../Models/Admin");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const createAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });}
  const { name, email, password } = req.body;
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    return next(error);
  }
  if (existingAdmin) {
    const error = new HttpError(
      "Email already exists, please try loggin in",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try{
    hashedPassword=await bcrypt.hash(password,12)
  }catch(err){
    const error=new HttpError("something went wrong, could not signup, please try again",500)
    return next(error)
  }
  const createdAdmin = new Admin({
    name,
    email,
    password:hashedPassword,
    image:req.file.path,
    
  });

  try {
    await createdAdmin.save();
  }catch (err) {
    const error = new HttpError(
      "Something went wrong, could not create Admin, please try again",
      500
    );
    return next(error);
  }
  let token;
  try{
    token = jwt.sign(
      { userId: createdAdmin.id, email: createdAdmin.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    )}catch(err){
      const error = new HttpError(
        "something went wrong, signing up failed, please try again",
        500
      );
      return next(error)
    }


  res.status(201).json({userId:createdAdmin.id, email:createdAdmin.email,token:token});
};
const getAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find({}, "-password").lean();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find Admins, please try again",
      500
    );
    return next(error);
  }
  res.json({ admins: admins });
};
const getAdminIds = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find({}, {password:0, email:0, image:0, name:0}).lean();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find Admins, please try again",
      500
    );
    return next(error);
  }
  res.json({ admins: admins });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingAdmins;
  try {
    existingAdmins =await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong, please try again", 500);
    
    return next(error);
  }
  if (!existingAdmins ) {
    const error = new HttpError("Invalid crudentials, email is always small (even though you have given capital letters while creating), please try again,", 401);
    return next(error)
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingAdmins.password);
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
 
  let token;
  try{
    token = jwt.sign(
      { userId: existingAdmins.id, email: existingAdmins.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    )}catch(err){
      const error = new HttpError(
        "something went wrong, signing up failed,please try again",
        500
      );
      return next(error)
    }


  res.status(201).json({userId:existingAdmins.id, email:existingAdmins.email,token:token});
};
const getAdminByEmail=async(req,res,next)=>{
    const email=req.params.email
    let admin
    try{
        admin=await Admin.findOne({email:email})
    }catch(err){
        console.log(err)
        const error = new HttpError("Something went wrong, could not find the Admin", 500);
    return next(error)
    }
    if(!admin){
        const error = new HttpError("Could not find the Admin with the given email", 500);
    return next(error)
    }
    res.json({admin:admin})
}

const updateAdmin=async(req,res,next)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again", 422));
  }
    const email=req.params.email
    const{name,password,image}=req.body
    let admin
    
    try{
        admin=await Admin.findOne({email:email})
        
    }catch(err){
        console.log(err)
        const error = new HttpError("Something went wrong, could not find the Admin or could not update the Admin, please try again", 500);
    return next(error)
    }
    if(!admin){
      const error = new HttpError("the is no admin with the give mail, please try again", 500);
    return next(error)
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not update the admin, please try again",
      500
    );
    return error;
  }
  admin.name=name,
  admin.password=hashedPassword,
  admin.image=image
  try{
    await admin.save()
  }catch (err) {
    const error = new HttpError(
      "something went wrong, updating  failed, please try again",
      500
    );
  }
    try{
      token = jwt.sign(
        { userId: admin.id, email: admin.email },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
  
    }catch(err){
      const error = new HttpError(
        "something went wrong, updating failed,please try again",
        500
      );
      return next(error)
    }
   
  
    res.status(201).json({ userId: admin.id,email:admin.email,token:token });
  

}
const deleteAdmin=async(req,res,next)=>{
    const email=req.params.email
    let admin
    try{
        admin=await Admin.findOne({email:email})
    }catch(err){
        console.log(err)
        const error = new HttpError("Something went wrong, could not find the Admin , please try again", 500);
    return next(error)
    }
    if(!admin){
      return next(new HttpError("Admin not found"))
  }
  const imagePath=place.image
    try{
      await admin.deleteOne()
    }catch (err) {
      console.log(err);
      const error = new HttpError(
        "something went wrong, could not delete the admin, please try again",
        500
      );
      return next(error);
    }
    fs.unlink(imagePath,(err)=>{
      console.log(err)
    })
    res.status(200).json({message:"Admin successfully deleted"})
    
}
exports.createAdmin = createAdmin;
exports.getAdmins = getAdmins;
exports.getAdminIds = getAdminIds;
exports.login=login
exports.getAdminByEmail=getAdminByEmail
exports.updateAdmin=updateAdmin
exports.deleteAdmin=deleteAdmin
