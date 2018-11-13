const express = require('express');
const router  = express.Router();
const Food = require('../models/Food')

/* GET home page */
// ppt page : 1
// list brief information of all foods
// difficulty:filter function
// reference: week5 day5 express| file upload cdn
router.get('/', (req, res, next) => {
  Food.find({status: 1})
  .then((foods) => {
   let isConnected = res.locals.isConnected ;
    res.render('index', { foods, isConnected});
  })
  .catch((error) => {
    console.log(error)
  })
});

router.post('/', (req, res, next) => {
  let isConnected = res.locals.isConnected ;
  console.log("req.body: ",req.body)
  let searchType = req.body.kind;
  let searchValue = req.body.content;

  Food.find({[searchType]: searchValue, status:1}).then(foods =>{
    res.render('index', { foods, isConnected});
  }).catch((error) => {
    console.log(error)
  })
});

module.exports = router;
