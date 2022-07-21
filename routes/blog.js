var express = require('express');
var router = express.Router();
const models = require('../models/models');
const { body, validationResult } = require('express-validator');
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

/* GET home page. */
router.get('/', async function (req, res, next) {
    const posts = await models.posts.find({'status': 'Active'});
    res.render('blog/posts.hbs', { "posts": posts });
});

//Create post form
router.get('/create-post', async function (req, res, next) {
    const categories = await models.category.find({ 'status': 'Active' });
    res.render('blog/create_post.hbs', { 'categories': categories });
});

//Create post 
router.post('/create-post', upload.single('image'), async function (req, res, next) {
    console.log(req)
    var data = req.body
    if (req.file) {
        data.image = "/media/" + req.file.filename
    }
    const post = new models.posts(data)
    
    try {
        const postData = await post.save();
        res.redirect('/');
    }
    catch (error) {
        const categories = await models.category.find({ 'status': 'Active' });
        res.render('blog/create_post.hbs', { 'categories': categories, 'error': 'Something went wrong.' + error });
    }
});

/* GET post detail page. */
router.get('/:slug', async function (req, res, next) {
    const post = await models.posts.findOne({ 'status': 'Active', 'slug': req.params.slug });
    res.render('blog/post_detail.hbs', { "post": post });
});



module.exports = router;
