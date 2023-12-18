const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  date: { type: Date, required: true },
  present: { type: Boolean, default: false },
});


module.exports = mongoose.model("Attendance", attendanceSchema);
