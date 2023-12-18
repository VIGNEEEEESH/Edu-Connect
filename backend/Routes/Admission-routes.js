const express=require("express")
const {check}=require("express-validator")
const router=express.Router()
const admissionControllers=require("../Controllers/Admission-controllers")
const checkAuth = require("../middleware/check-auth")

router.get("/get",admissionControllers.getAdmissions)
router.get("/get/name/:name",admissionControllers.getAdmissionsByName)
router.get("/get/id/:id",admissionControllers.getAdmissionsById)

router.post("/add",[
    check("studentName").notEmpty(),
    check("fatherName").notEmpty(),
    check("fatherNumber").notEmpty(),
    check("fatherQualification").notEmpty(),
    check("motherName").notEmpty(),
    check("motherNumber").notEmpty(),
    check("motherQualification").notEmpty(),
    check("classNumber").notEmpty(),
    check("progress").notEmpty(),
    check("previousSchool").notEmpty(),
    check("studentRemarks").notEmpty()
],admissionControllers.addAdmission)
router.use(checkAuth)
router.patch("/update/:id",[
    check("studentName").notEmpty(),
    check("fatherName").notEmpty(),
    check("fatherNumber").notEmpty(),
    check("fatherQualification").notEmpty(),
    check("motherName").notEmpty(),
    check("motherNumber").notEmpty(),
    check("motherQualification").notEmpty(),
    check("classNumber").notEmpty(),
    check("progress").notEmpty(),
    check("previousSchool").notEmpty(),
    check("studentRemarks").notEmpty()
],admissionControllers.updateAdmissionsById)
router.delete("/delete/:id",admissionControllers.deleteAdmissionsById)
module.exports=router