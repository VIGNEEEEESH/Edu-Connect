const mongoose=require("mongoose")
const {validationResult}=require("express-validator")
const Image =require("../Models/Gallery")
const HttpError = require("../Models/http-error")

const addImage=async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return next(
            new HttpError("Invalid inputs passed, please try again",422)
        )
    }
    
    const addedImage=new Image({
        image:req.file.path
    })
    
    try{
        await addedImage.save()
    }catch(err){
        const error=new HttpError(
            "Something went wrong, adding image failed, please try again.",500
        )
        return next(error)
    }
    res.status(201).json({image:addedImage})
}
const getImage=async(req,res,next)=>{
    let images
    try{
        images=await Image.find()
    }catch(err){
        const error=new HttpError(
            "Something went wrong, fetching images failed, please try again.",500
        )
        return next(error)
    }
    res.status(200).json({images:images})
}
const deleteImageById=async(req,res,next)=>{
    const id=req.params.id
    let image
    try{
      image=await Image.findOne({_id:id})
    }catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find the image, please try again",
        500
      );
      return next(error);
    }
    if(!image){
        
      const error=new HttpError("Image not found, please try again",500)
      return next(error)
    }
    try{
      await image.deleteOne()
    }catch (err) {
      
      const error = new HttpError(
        "something went wrong, could not delete the image, please try again",
        500
      );
      return next(error);
    }
    res.status(200).json({ message: "The image Successfully deleted" }); 
  }
exports.addImage=addImage
exports.getImage=getImage
exports.deleteImageById=deleteImageById
