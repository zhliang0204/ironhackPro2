const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const Food = require('../models/Food');
const Mesg = require('../models/Message');
const uploadCloud = require('../config/cloudinary.js')

// check user login
function ensureAuthenticated(req, res, next){
  if (req.user) {
    return next();
  } else {
    res.redirect('/auth/login')
  }
}


// create or upload new food information
// ppt page 9
router.get('/profile/create',ensureAuthenticated, (req,res,next)=> {
  console.log("food-create");
  res.render('foods/food-create');
})

// submit create or upload new food information
// ppt page 9
// redirect to the user profile after submit successfully
router.post('/profile/create',ensureAuthenticated, uploadCloud.single('photo'),(req, res, next)=> {
  const { name, cuisine, description } = req.body;
  const imgPath = req.file.url;
  // const imgName = req.file.originalname;
  const newFood = new Food({name, cuisine, description, imgPath})
  newFood.save()
  .then(food => {
    res.redirect('/foods')
  })
  .catch(error => {
    console.log(error)
  })
})

// home page after login
// ppt page 4
// list brief information of all food after login
<<<<<<< HEAD
router.get('/foods', (req, res, next) => {
         
=======
router.get('/foods', ensureAuthenticated,(req, res, next) => {

>>>>>>> f2bc59704e34bc3588de11d76cb1583b4b05823b
  res.render('foods/afterloginindex');
});


// ppt page 4
router.post('/foods', ensureAuthenticated,(req, res, next)=> {
  // functionality about filter
  // question: filter  back-end or front-end??
  res.render('foods/afterloginindex')
});


// detail information about one food
// ppt page 5
router.get('/foods/:foodId', ensureAuthenticated, (req, res, next)=> {
  // foodId: food id
  res.render('foods/food-detail')
});

// food order information
// ppt page 6
router.get('/foods/order/:foodId', ensureAuthenticated, (req, res, next)=> {

  res.render('foods/food-order')
});

// submit the order information
// ppt page 6
// redirect to the home page(login) after submit successfully
router.post('/foods/order/:foodId', ensureAuthenticated,(req, res, next) => {
  res.redirect('/foods')
});

// list brief information of all food provieded by one user 
// ppt page 7
router.get('/profile/:userId', ensureAuthenticated, (req, res, next) => {
  // userId: userid
  res.render('foods/foodprofile')
});


// watch order message 
// ppt page 8
router.get('/profile/:userId/:foodId', ensureAuthenticated, (req, res, next) => {
  res.render('foods/foodprofile-orderInfo')
})



// user edit food information 
// ppt page 10
router.get('/profile/edit/:foodId', (req, res, next) => {
  // id: foodid
  res.render('foods/food-edit')
})

// submit edited food information
// ppt page 10
// redirect to the user profile after submit successfully
router.post('/profile/edit/:foodId', (req, res,next)=> {
  res.redirect('/profile/:userId')
})


// delete food information
router.get("/profile/delete/:foodId", (req, res, next) => {
  res.redirect('/profile/:userId')
})

module.exports = router;
