var express = require('express');
var router = express.Router();
const models = require('../../models/models');

//Post Method
router.post('/category', async (req, res) => {
    const category = new models.category({
        title: req.body.title,
        status: req.body.status
    })
    try {
        const catData = await category.save();
        res.status(200).json({"status": true, "data":catData})
    }
    catch (error) {
        res.status(400).json({ "status": false, "message": error.message })
    }
})

//Get all Method
router.get('/category', async (req, res) => {
    try {
        const data = await models.category.find();
        res.status(200).json({ "status": true, "data": data})
    }
    catch (error) {
        res.status(500).json({ "status": false, "message": error.message })
    }
})

//Get by ID Method
router.get('/category/:id', async (req, res) => {
    try {
        const data = await models.category.findById(req.params.id);
        if (!data){
            res.status(404).json({ "status": false, "message": "Category not found." });
        }
        else{
            res.status(200).json({ "status": true, "data": data})
        }
        
    }
    catch (error) {
        res.status(500).json({ "status": false, "message": error.message })
    }
})

//Update by ID Method
router.patch('/category/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        updatedData.utimestamp = Date.now()
        const options = { new: true };
        const result = await models.category.findByIdAndUpdate(
            id, updatedData, options
        )
        if (!result){
            res.status(404).json({ "status": false, "message": "Category not found." });
        }else{
            res.status(200).send({ "status": true, "data": result});
        }
        
    }
    catch (error) {
        res.status(400).json({ "status": false, "message": error.message })
    }
})

//Delete by ID Method
router.delete('/category/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const data = await models.category.findByIdAndDelete(id)
        if(!data){
            res.status(404).json({ "status": false, "message": "Category not found." });
        }else{
            res.status(200).send({"status": true, "message": "Category deleted successfully."});
        }
    }
    catch (error) {
        res.status(400).json({ "status": false, "message": error.message })
    }
})

module.exports = router;
