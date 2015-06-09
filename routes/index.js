var express = require('express');
var router = express.Router();




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Google API test server' , 
    authMessage: 'Dear Google:) Auth me please!',
    whPath: process.env.WEBHOOKS_SUBSCRIPTION_PATH});
  });

module.exports = router;
