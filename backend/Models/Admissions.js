const mongoose=require("mongoose")
const Schema=mongoose.Schema

const admissionSchema=new Schema({
    studentName:{type:String,required:true},
    fatherName:{type:String,required:true},
    fatherNumber:{type:String,required:true},
    fatherQualification:{type:String,required:true},
    motherName:{type:String,required:true},
    motherNumber:{type:String,required:true},
    classNumber:{type:String,required:true},
    progress:{type:String,required:true},
    motherQualification:{type:String,required:true},
    previousSchool:{type:String,required:true},
    studentRemarks:{type:String,required:true}
})
module.exports=mongoose.model("Admission",admissionSchema)