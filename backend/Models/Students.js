const mongoose=require("mongoose")
const Schema=mongoose.Schema
const uniqueValidator=require("mongoose-unique-validator")
const studentDetailsSchema=new Schema({
    studentName:{type:String,required:true},
    fatherName:{type:String,required:true},
    motherName:{type:String,required:true},
    classNumber: { type: String, ref: "Detail", required: true },
    caste:{type:String,required:true},
    progress:{type:String,required:true},
    motherTongue:{type:String,required:true},
    bloodGroup:{type:String,required:true},
    fatherNumber:{type:String,required:true},
    motherNumber:{type:String,required:true},
    fatherOccupation:{type:String,required:true},
    motherOccupation:{type:String,required:true},
    rollNumber:{type:String,required:true},
    studentId:{type:Number,required:true,unique:true}
})
studentDetailsSchema.plugin(uniqueValidator)
module.exports=mongoose.model("Student",studentDetailsSchema)