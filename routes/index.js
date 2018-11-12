const express = require('express');
const router  = express.Router();
const Food = require('../models/Food')

/* GET home page */
// ppt page : 1
// list brief information of all foods
// difficulty:filter function
// reference: week5 day5 express| file upload cdn
router.get('/', (req, res, next) => {
  Food.find()
  .then((foods) => {
    res.render('index', { foods });
  })
  .catch((error) => {
    console.log(error)
  })
});

module.exports = router;
