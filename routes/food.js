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
  // console.log("req.user: ", req.user._id );
  res.render('foods/food-create');
})

// submit create or upload new food information
// ppt page 9
// redirect to the user profile after submit successfully
router.post('/profile/create',ensureAuthenticated, uploadCloud.single('photo'),(req, res, next)=> {
  const { name, cuisine, description, availability } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const _owner = req.user._id;
  const newFood = new Food({name, cuisine, description, availability,imgPath, imgName, _owner})
  newFood.save()
  .then(food => {
    res.redirect('/')
  })
  .catch(error => {
    console.log(error)
  })
 })

 router.get('/error',ensureAuthenticated, (req,res,next)=> {

  res.render('auth/login', {alert:"Please Login"});

})

// home page after login
// ppt page 4
// list brief information of all food after login
// router.get('/foods', ensureAuthenticated,(req, res, next) => {
//   Food.find()
//   .then((foods) => {
//     res.render('foods/afterloginindex', { foods });
//   })
//   .catch((error) => {
//     console.log(error)
//   })
// });
  


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
  let id = req.params.foodId
  Food.findById(id)
  .then(foodFromDb=>{
    User.findById(foodFromDb._owner).then(user => {
      // console.log(foodFromDb);
      // console.log(user);
      res.render('foods/food-detail',{food:foodFromDb, user:user});
    })
   
// router.get('/foods/:id', ensureAuthenticated, (req, res, next)=> {
//   // foodId: food id
//   let id = req.params.id
//   Food.findById(id)
//   .then(foodFromDb=>{
//     res.render('foods/food-detail',{food:foodFromDb});
//   })
// .catch(error => {
//   next(error)
// })
//   res.render('foods/food-detail')
});
})

// food order information
// ppt page 6
router.get('/foods/order/:foodId', ensureAuthenticated, (req, res, next)=> {
  let foodId = req.params.foodId;
  Food.findById(foodId).then(food=> {
    res.render('foods/food-order',{food})
  })

  
});

// submit the order information
// ppt page 6
// redirect to the home page(login) after submit successfully
router.post('/foods/order/:foodId', ensureAuthenticated,(req, res, next) => {
  let foodId = req.params.foodId;
  const msg = req.body.message;
  // console.log("msg: ", msg)
  Mesg.create({
    content:msg,
    _foodId: foodId,
    _sender:req.user.id,
  }).then(message => {
    // console.log(message)
    // consider new page
    // res.redirect('/foods')
    Food.findByIdAndUpdate(message._foodId, {
      status: 0
    }).then(food => {
      res.redirect('/')
    })
  })
  
});

// list brief information of all food provieded by one user 
// ppt page 7
router.get('/profile', ensureAuthenticated, (req, res, next) => {
  // userId: userid
  let userId = req.user.id;
  // console.log(userId)
  Food.find({_owner:  userId}).then(foods => {
    res.render('foods/foodprofile', {foods: foods,userId:userId})
  })
});


// watch order message 
// ppt page 8
// router.get('/profile/message/:foodId', ensureAuthenticated, (req, res, next) => {
//   let foodId = req.params.foodId;
//   Food.findById(foodId).then(food => {
//     // console.log(food)
//     // res.render('foods/foodprofile-orderInfo',{food:food})
//     Mesg.findOne({_foodId:foodId}).then(message => {
//       res.render('foods/foodprofile-orderInfo',{food:food, message:message})
//     })
//   })
  
// })

router.get('/profile/message/:foodId', ensureAuthenticated, (req, res, next) => {
  let foodId = req.params.foodId;
  Food.findById(foodId).then(food => {
    // console.log(food)
    // res.render('foods/foodprofile-orderInfo',{food:food})
    Mesg.findOne({_foodId:foodId}).then(message => {
      User.findById(message._sender).then(user => {
        console.log(user)
        res.render('foods/foodprofile-orderInfo',{food:food, message:message, user:user})
      })
      // res.render('foods/foodprofile-orderInfo',{food:food, message:message})
    })
  })
 
 })


// user edit food information 
// ppt page 10
router.get('/profile/edit/:foodId', ensureAuthenticated, (req, res, next) => {
  // id: foodid
  let foodId = req.params.foodId;
  Food.findById(foodId).then(food => {
    // console.log(food)
    res.render('foods/food-edit', {food})
  })
  
})

// submit edited food information
// ppt page 10
// redirect to the user profile after submit successfully
router.post('/profile/edit/:foodId', ensureAuthenticated, uploadCloud.single('photo'), (req, res,next)=> {
  let foodId = req.params.foodId;
  Food.findByIdAndUpdate(foodId, {
    name:req.body.name,
    cuisine : req.body.cuisine, 
    description: req.body.description, 
    availability: req.body.availability,
    imgPath: req.file.url,
    imgName: req.file.originalname,
  }).then(food => {
    res.redirect('/profile')
  })
})


// delete food information
router.get("/profile/delete/:foodId", ensureAuthenticated, (req, res, next) => {
  let foodId = req.params.foodId;
  Food.findByIdAndRemove(foodId).then(food => {
    res.redirect('/profile')
  })
})


 


module.exports = router;
