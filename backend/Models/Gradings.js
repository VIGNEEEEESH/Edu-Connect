const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const gradingSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  studentName: { type: String, ref: "Student", required: true },
  rollNumber: { type: String, ref: "Student", required: true },
  examName: { type: String, required: true,unique:true },
  classNumber:{type:String,required:true,ref:"Detail"},
  subjects: [
    {
      subjectName: { type: String, required: true },
      maxMarks: { type: Number, required: true },
      marksObtained: { type: Number, default: 0 },
    },
  ],
  totalMarks: { type: String, default: "0" },
  percentage: { type: String, default: "0" },
});

gradingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Grading", gradingSchema);
