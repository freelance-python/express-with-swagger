var express = require('express');
var router = express.Router();
const models = require('../../models/models');
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd() + "/media/")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

var upload = multer({ storage: storage });

//Post Method
router.post('/post', upload.single('image'), async (req, res) => {
    const post = new models.posts({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
    })
    if (req.file){
        post.image = "/media/" + req.file.filename
    }
    try {
        const postData = await post.save();
        res.status(200).json({"status": true, "data":postData})
    }
    catch (error) {
        res.status(400).json({ "status": false, "message": error.message })
    }
})

//Get all Method
router.get('/post', async (req, res) => {
    try {
        const data = await models.posts.find();
        res.status(200).json({"status": true, "data": data})
    }
    catch (error) {
        res.status(500).json({ "status": false, "message": error.message })
    }
})

//Get by ID Method
router.get('/post/:id', async (req, res) => {
    try {
        const data = await models.posts.findById(req.params.id);
        if (!data) {
            res.status(404).json({ "status": false, "message": "Post not found." });
        }
        else {
            res.status(200).json({ "status": true, "data": data})
        }

    }
    catch (error) {
        res.status(500).json({ "status": false, "message": error.message })
    }
})

//Update by ID Method
router.patch('/post/:id', upload.single('image'), async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        updatedData.utimestamp = Date.now()
        if (req.file) {
            updatedData.image = "/media/" + req.file.filename
        }
        
        const options = { new: true };
        const result = await models.posts.findByIdAndUpdate(
            id, updatedData, options
        )
        if (!result) {
            res.status(404).json({ "status": false, message: "Post not found." });
        } else {
            res.status(200).send({ "status": true, "data": result});
        }

    }
    catch (error) {
        res.status(400).json({ "status": false, "message": error.message })
    }
})

//Delete by ID Method
router.delete('/post/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await models.posts.findByIdAndDelete(id)
        if (!data) {
            res.status(404).json({ "status": false, "message": "Post not found." });
        } else {
            res.status(200).send({ "status": true, "message": "Post deleted successfully." });
        }
    }
    catch (error) {
        res.status(400).json({ "status": false, "message": error.message })
    }
})

module.exports = router;
