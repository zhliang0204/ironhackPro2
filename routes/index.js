const express = require('express');
const router  = express.Router();
const Food = require('../models/Food')

/* GET home page */
// ppt page : 1
// list brief information of all foods
// difficulty:filter function
// reference: week5 day5 express| file upload cdn
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next)=> {
  // functionality about filter
  // question: filter  back-end or front-end??
  res.render('index')
})

module.exports = router;
