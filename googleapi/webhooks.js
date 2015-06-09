var express = require('express');
var router = express.Router();
var parseUrl = require('node-parse-url');
var google = require('googleapis');
var fs = require('fs');
var OAuth2 = google.auth.OAuth2;
 
var oauth2Client = new OAuth2(process.env.CLIENT_ID , process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
 
// generate a url that asks permissions for Google+ and Google Calendar scopes 
var scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://spreadsheets.google.com/feeds'
];


var ourWebHooksListenerPath =  process.env.WEBHOOKS_LISTENER_PATH;
var ourWebHooksSubscriptionPath =  process.env.WEBHOOKS_SUBSCRIPTION_PATH;


function handleIncomingWebhook(req, res, next) {
  //var code = req.query.code;
  console.log('WebHook Called '+ourWebHooksListenerPath+': '+req);
}

function subscribeForGDWebhook(req, res, next) {
  console.log('WebHook Subscription called!');
  console.log(req.session);
  var gdTokens = req.session.gdTokens;
  if (!gdTokens || (new Date() > new Date(gdTokens.expiry_date))){
    console.log('Redirecting to Auth 2.0 facility, then back here');
    req.session.redirect = ourWebHooksSubscriptionPath;
    res.redirect('/auth');
  } else {
    req.session.redirect = undefined;
    console.log('Token is fresh, let us try to subscribe web hooks');
    oauth2Client.setCredentials(gdTokens);
    var drive = google.drive({version: 'v2', auth: oauth2Client});
    var watchParams = {
        "id": string,
        "token": string,
        "expiration": long,
        "type": string,
        "address": string
      }
    drive.changes.watch(watchParams,)
    var locals = {
        body: 'Subscription Data here ... Enjoy it!',
        req:req
      };
    res.render('whsubscribed', locals);
  }
}


router.get(ourWebHooksListenerPath, handleIncomingWebhook);
router.get(ourWebHooksSubscriptionPath, subscribeForGDWebhook);

module.exports = router;
