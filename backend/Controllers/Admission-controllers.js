const HttpError=require("../Models/http-error")
const {validationResult}=require("express-validator")
const mongoose=require("mongoose")
const Admission=require("../Models/Admissions")

const addAdmission=async(req,res,next)=>{
    const errors=validationResult(req)
    
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed, please try again"))
    }

    const {studentName,fatherName,fatherNumber,fatherQualification,motherName,motherNumber,classNumber,motherQualification,progress,previousSchool,studentRemarks}=req.body
    const addedAdmission=new Admission({
        studentName,
        fatherName,
        fatherNumber,
        fatherQualification,
        motherName,
        motherNumber,
        classNumber,
        progress,
        motherQualification,
        previousSchool,
        studentRemarks
    })
    try{
        await addedAdmission.save()
    }catch(err){
        
        const error=new HttpError("something went wrong, could not add admission request, please try again",500)
        return next(error)
    }
    res.status(201).json({addedAdmission:addedAdmission})

}
const getAdmissions=async(req,res,next)=>{
    let admissions
    try{
        admissions=await Admission.find()
        
    }catch(err){
        console.log(err)
        const error=new HttpError("Something went wrong, please try again",500)
        return next(error)
    }
    if(!admissions || admissions.length==0){
        const error=new HttpError("No admission found",404)
    return next(error)
    }
    res.json({admissions:admissions})
}
const getAdmissionsByName=async(req,res,next)=>{
    const name=req.params.name
    let admissions
    try{
        admissions=await Admission.find({name:name})
        
    }catch(err){
        const error=new HttpError("Something went wrong, could not fetch the admissions",500)
    return next(error)
    }
    if(!admissions || admissions.length==0){
        const error=new HttpError("No admission found with the given name",404)
    return next(error)
    }
    res.json({admissions:admissions})

}
const getAdmissionsById=async(req,res,next)=>{
    const id=req.params.id
    let admissions
    try{
        admissions=await Admission.findOne({_id:id})
        
    }catch(err){
        const error=new HttpError("Something went wrong, could not fetch the admissions",500)
    return next(error)
    }
    if(!admissions || admissions.length==0){
        const error=new HttpError("No admission found with the given id",404)
    return next(error)
    }
    res.json({admissions:admissions})

}
const updateAdmissionsById=async(req,res,next)=>{
    const id=req.params.id
    const {studentName,fatherName,fatherNumber,fatherQualification,motherName,motherNumber,classNumber,motherQualification,progress,previousSchool,studentRemarks}=req.body

    let admissions
    try{
        admissions=await Admission.findOne({_id:id})
    }catch(err){
        const error=new HttpError("something went wrong, could not find the admission, please try again",500)
        return next(error)
    }
    
        admissions.studentName=studentName,
        admissions.fatherName=fatherName,
        admissions.fatherNumber=fatherNumber,
        admissions.fatherQualification=fatherQualification,
        admissions.motherName=motherName,
        admissions.motherNumber=motherNumber,
        admissions.classNumber=classNumber,
        admissions.progress=progress,
        admissions.motherQualification=motherQualification,
        admissions.previousSchool=previousSchool,
        admissions.studentRemarks=studentRemarks
    
    if(!admissions || admissions.length==0){
        const error=new HttpError("No admission found with the given name",404)
    return next(error)
    }

    try{
        await admissions.save()
    }catch(err){
        const error=new HttpError("something went wrong, could not update the admission, please try again",500)
        return next(error)
    }
    res.json({admission:admissions})

}
const deleteAdmissionsById=async(req,res,next)=>{
    const id=req.params.id
    let admission
    try{
        admission=await Admission.findById(id)
        if(!admission){
            return next(new HttpError("admission not found"))
        }
        await admission.deleteOne()
    }catch(err){
        console.log(err)
        const error = new HttpError("Something went wrong, could not delete the admission , please try again", 500);
    return next(error)
    }
    res.status(200).json({message:"admission successfully deleted"})
    
}

exports.addAdmission=addAdmission
exports.getAdmissions=getAdmissions
exports.getAdmissionsByName=getAdmissionsByName
exports.getAdmissionsById=getAdmissionsById
exports.updateAdmissionsById=updateAdmissionsById
exports.deleteAdmissionsById=deleteAdmissionsById