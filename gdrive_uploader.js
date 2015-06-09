var request = require('request');

var tokens = { access_token: 'ya29.iAGFNDpRwQqeyIrvrtWnF5UYu57XfamT5UJ6Ofu2LCIrkjfY5-yjYiBo3niT2_vxOQL7sIxas4vtdQ',
  token_type: 'Bearer',
  expiry_date: 1433404527066 };

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
 
var oauth2Client = new OAuth2();
oauth2Client.setCredentials(tokens);


function insertDocFile2Drive(){
  var drive = google.drive({version: 'v2', auth: oauth2Client});
  //resource.description = 'Added by Stringify GoogleDrive Thing'
  //indexableText.text  string  The text to be indexed for this file. writable
  //labels.hidden boolean Deprecated. writable
  //labels.restricted boolean Whether viewers are prevented from downloading this file. writable
  //labels.starred  boolean Whether this file is starred by the user. writable
  //labels.trashed  boolean Whether this file has been trashed. This label applies to all users accessing the file; however, only owners are allowed to see and untrash files.  writable
  //labels.viewed boolean Whether this file has been viewed by this user. writable
  //lastViewedByMeDate  datetime  Last time this file was viewed by the user (formatted RFC 3339 timestamp).  writable
  //markedViewedByMeDate  datetime  Time this file was explicitly marked viewed by the user (formatted RFC 3339 timestamp). writable
  //resource.mimeType = 'application/vnd.google-apps.document';
  //media.mimeType = 'application/vnd.google-apps.document'; //  string  The MIME type of the file. This is only mutable on update when uploading new content. This field can be left blank, and the mimetype will be determined from the uploaded content's MIME type.  writable
  //modifiedDate  datetime  Last time this file was modified by anyone (formatted RFC 3339 timestamp). This is only mutable on update when the setModifiedDate parameter is set.  writable
  //!! parents[] list  Collection of parent folders which contain this file.
  //Setting this field will put the file in all of the provided folders. On insert, if no folders are provided, the file will be placed in the default root folder.
  //writable
  //properties[]  list  The list of properties. writable
  //resource.title = 'New document by Stringify '; //string  The title of the file. Used to identify file or folder name.  writable
  //writersCanShare
  //media.body = 'Test text';
  rosettaTestFolderId = '0B7rluPmKZswjfjE2RS1WelpLYnAxZmRSQ2UzbmNjbjhUNmNYT2hJZDBTd0dRMTJRZ0ZuLVk';
  debugger;
  var fileData ={
   resource: {
        title: 'Test move to folder',
        mimeType: 'text/plain',
    },
    media: {
        mimeType: 'text/plain',
        body: 'Moved! Hello World updated with metadata'
    }
  };
  
  drive.files.insert(fileData,function(err, data){
      console.log(err,data);
      if (!err) {
        drive.children.insert({
          folderId: rosettaTestFolderId,
          resource: {
            id: data.id
          }
        }, function(err, response) {
          console.log(err, response);
        });
      };
  });  
}

function uploadFile(url){
  //get file, including headers with headers, mime types, etc
  var getFile = function (aUrl,fPipe){
    var options = undefined;
    request
      .get(aUrl)
      .on('error', function(err) {
          console.log(err);
      })
      .on('response', function(response) {
        debugger;
        options.mimeType = response.headers['content-type'];
        options.fileSize = response.headers['content-length'];
        console.log(response.statusCode); // 200
        console.log(options.mimeType); // 'image/png'
      })
      //.pipe(fPipe(options));
   };
  var writeFile =  function(options){
    return request.put 
  };
  var uploadFile2Drive = function(err, response, body){
      //rest.get("http://serviceURL").on('success', function(result){
      //  strnfyEventCallback(err, true);   //Call true as the result to continue any cascading flow.
      //});
    };
  getFile(url);
}

var fileURL = 'https://www.google.com.ua/images/nav_logo195_hr.png';
//uploadFile(fileURL);
insertDocFile2Drive();
