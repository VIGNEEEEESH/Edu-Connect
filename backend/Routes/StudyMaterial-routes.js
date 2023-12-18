const express = require('express');
const StudyMaterialController = require('../Controllers/StudyMaterial-controllers');
const fileUpload = require('../middleware/material-upload');
const { check } = require("express-validator");

const router = express.Router();

// Route for fetching all files
router.get('/files', StudyMaterialController.getFiles);
router.get("/files/classNumber/:classNumber",StudyMaterialController.getFilesByClassNumber)

router.post('/add/:classNumber', fileUpload.single('file'),[
    check("fileName").notEmpty(),
    check("classNumber").notEmpty()
], StudyMaterialController.addFile);

// Route for deleting a file by ID
router.delete('/files/:id', StudyMaterialController.deleteFileById);

module.exports = router;
