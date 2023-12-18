const mongoose=require("mongoose")
const Schema=mongoose.Schema
const uniqueValidator=require("mongoose-unique-validator")


const teacherSchema=new Schema({
    name:{type:String,required:true},
    qualification:{type:String,required:true},
    subjects: { type: String, required: true },
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:6},
    image:{type:String,required:true}
})
teacherSchema.plugin(uniqueValidator)
module.exports=mongoose.model("Teacher",teacherSchema)