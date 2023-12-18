const mongoose=require("mongoose")
const Schema=mongoose.Schema



const passcodeSchema=new Schema({
    password:{type:String,required:true,minlength:6}
})

module.exports=mongoose.model("Passcode",passcodeSchema)