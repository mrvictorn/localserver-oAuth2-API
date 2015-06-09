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

var url = oauth2Client.generateAuthUrl({
  scope: scopes // If you only need one scope you can pass it as string 
});



var ourAuthPath =  parseUrl(process.env.REDIRECT_URL).path;


function insertDocFile2Drive(){
  var drive = google.drive({version: 'v2', auth: oauth2Client});
  var options = {};
  options.description = 'Added by Stringify GoogleDrive Thing'
  //indexableText.text  string  The text to be indexed for this file. writable
  //labels.hidden boolean Deprecated. writable
  //labels.restricted boolean Whether viewers are prevented from downloading this file. writable
  //labels.starred  boolean Whether this file is starred by the user. writable
  //labels.trashed  boolean Whether this file has been trashed. This label applies to all users accessing the file; however, only owners are allowed to see and untrash files.  writable
  //labels.viewed boolean Whether this file has been viewed by this user. writable
  //lastViewedByMeDate  datetime  Last time this file was viewed by the user (formatted RFC 3339 timestamp).  writable
  //markedViewedByMeDate  datetime  Time this file was explicitly marked viewed by the user (formatted RFC 3339 timestamp). writable
  options.mimeType = 'application/vnd.google-apps.document'//  string  The MIME type of the file. This is only mutable on update when uploading new content. This field can be left blank, and the mimetype will be determined from the uploaded content's MIME type.  writable
  //modifiedDate  datetime  Last time this file was modified by anyone (formatted RFC 3339 timestamp). This is only mutable on update when the setModifiedDate parameter is set.  writable
  //!! parents[] list  Collection of parent folders which contain this file.
  //Setting this field will put the file in all of the provided folders. On insert, if no folders are provided, the file will be placed in the default root folder.
  //writable
  //properties[]  list  The list of properties. writable
  options.title = 'New document by Stringify ' //string  The title of the file. Used to identify file or folder name.  writable
  //writersCanShare
  debugger;
  drive.files.insert(options,function(err, data){
      console.log(err,data);
  });  
}

function getDriveUserInfo(res,keyMatureInfo){
  var drive = google.drive({version: 'v2', auth: oauth2Client});
  drive.about.get(function(err, data){
    console.log('And user data: ');
    console.log(data);
    var locals = {
        userData: '../.accesstoken file refreshed with new key, </br> Enjoy it!'+
        '<br/><strong>'+keyMatureInfo+'</strong>',
        goHome:true
      };
    res.render('index', locals);
  });  
}

function getMyAuth(req, res, next) {
  var code = req.query.code;
  var redirectTo = req.session.redirect;
  console.log('Auth code is: '+code);
  oauth2Client.getToken(code, function(err, tokens) {
    if(!err) {
      oauth2Client.setCredentials(tokens);
      req.session.gdTokens = tokens;
      console.log(req.session);
      var keyMature = 'Key will expiry at '+ new Date(tokens.expiry_date);
      console.log('And user tokens: ',tokens);
      fs.writeFileSync('../.accesstoken',tokens.access_token);
      if (redirectTo) {
        res.redirect(redirectTo);
      } else {
        getDriveUserInfo(res,keyMature);
      }
      //insertDocFile2Drive();
    }
  });
  
}



/* Send user to google auth facility */
router.get('/auth', function(req, res, next) {
  res.redirect(url);
});

router.get(ourAuthPath, getMyAuth);



module.exports = router;
