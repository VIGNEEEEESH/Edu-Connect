const express=require("express")
const {check}=require("express-validator")
const router=express.Router()
const eventControllers=require("../Controllers/Event-controllers")
const checkAuth = require("../middleware/check-auth")
const fileUpload=require("../middleware/file-upload")


router.get("/get",eventControllers.getEvents)
router.get("/get/:id",eventControllers.getEventById)
router.use(checkAuth)
router.post("/add",fileUpload.single("image"),[
    check("title").isLength({min:5}),
    check("description").isLength({min:5}),
    check("date").notEmpty(),
    check("time").notEmpty(),
    
],eventControllers.createEvent)
router.patch("/update/:id",fileUpload.single("image"),[
    check("title").isLength({min:5}),
    check("description").isLength({min:5}),
    check("date").notEmpty(),
    check("time").notEmpty(),
    
],eventControllers.updateEvent)
router.delete("/delete/:id",eventControllers.deleteEvent)
module.exports=router