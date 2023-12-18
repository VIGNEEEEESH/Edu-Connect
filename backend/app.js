const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const detailsRoutes = require("./Routes/Details-routes");
const teacherRoutes=require("./Routes/Teachers-routes")
const studentRoutes=require("./Routes/Students-routes")
const adminRoutes=require("./Routes/Admins-routes")
const admissionRoutes=require("./Routes/Admission-routes")
const studymaterialRoutes=require("./Routes/StudyMaterial-routes")
const eventRoutes=require("./Routes/Event-routes")
const galleryRoutes=require("./Routes/Gallery-routes")
const gradingRoutes=require("./Routes/Grading-routes")
const attendanceRoutes=require("./Routes/Attendance-routes")
const postRoutes=require("./Routes/Post-routes")
const passcodeRoutes=require("./Routes/Passcode-routes")
const app = express();
const fs=require("fs")
const path=require("path")
// const fetch = require("node-fetch"); 
import('node-fetch').then((fetchModule) => {
  // Use fetchModule here
}).catch((error) => {
  console.error("Error importing node-fetch:", error);
});
app.use(bodyParser.json());
app.use("/uploads/images",express.static(path.join("uploads","images")))
app.use("/uploads/files",express.static(path.join("uploads","files")))
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use("/api/joshua/document/studymaterial", studymaterialRoutes);
app.use("/api/joshua/authentication/teacher",teacherRoutes)
app.use("/api/joshua/authentication/admin",adminRoutes)
app.use("/api/students",studentRoutes)
app.use("/api/admission",admissionRoutes)
app.use("/api/event",eventRoutes)
app.use("/api/Attendance",attendanceRoutes)
app.use("/api/gallery",galleryRoutes)
app.use("/api/grading",gradingRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/passcode",passcodeRoutes)
app.use("/api/joshua", detailsRoutes);


app.use((error,req,res,next)=>{
  if(req.file){
    fs.unlink(req.file.path,(err)=>{
      console.log(err)
    })
  }
  if(res.headerSent){
    return next(error)
  }
  res.status(error.code||500)
  res.json({message:error.message || "An unknown error occured"})
})
const keepAliveInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
const keepAliveEndpoint = "https://edu3-gadu.onrender.com/keep-alive"; 

function sendKeepAlive() {
  setTimeout(async () => {
    try {
      await fetch(keepAliveEndpoint);
      console.log("Keep-alive request sent");
    } catch (error) {
      console.error("Error sending keep-alive request:", error.message);
    } finally {
      sendKeepAlive();
    }
  }, keepAliveInterval);
}

// Start sending keep-alive requests
sendKeepAlive();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rw3waqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(app.listen(4445))
  .catch((err) => {
    console.log(err);
  });
