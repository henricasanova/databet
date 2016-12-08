/*
 * THIS IS NOT A BASE MONGO COLLECTION - IT'S A METEOR-FILES COLLECTION
 */


import { Meteor } from 'meteor/meteor';

export var meteor_files_config = {};


if (Meteor.server) {

  var upload_root = process.env.UPLOAD_DIR;
  console.log("UPLOAD_DIR = ", upload_root);
  if (upload_root == undefined) {
    throw new Meteor.Error("UPLOAD_DIR environment variable must be defined");
  }

  console.log("Creating Directory " + upload_root + "/assessment_uploads/ ...");
  var Future = Npm.require("fibers/future");
  var exec = Npm.require("child_process").exec;
  var future = new Future();
  var dir = process.env.PWD;
  var command = "mkdir -p " + upload_root + "/assessment_uploads/";
  exec(command, {cwd: dir}, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
      throw new Meteor.Error(500, command + " failed");
    }
    future.return(stdout.toString());
  });
  future.wait();

  meteor_files_config["storagePath"] = upload_root + "/assessment_uploads/";
  console.log("UPLOAD STORAGE PATH =", meteor_files_config["storagePath"]);
}

meteor_files_config["debug"] = true;
meteor_files_config["collectionName"] = 'UploadedFiles';
meteor_files_config["allowClientCode"] = true;  // to allow file removal
meteor_files_config["onBeforeUpload"] = function (file) {
  // Allow upload files under 10MB, and only in png/jpg/jpeg/pdf/txt formats
  if (file.size <= 1024 * 1024 * 20 && /png|jpg|jpeg|pdf|txt/i.test(file.extension)) {
    return true;
  } else {
    return 'Please upload image, with size equal or less than 20MB';
  }
};


console.log("CREATING METEOR.FILES");

export var UploadedFiles = new Meteor.Files(meteor_files_config);





// OLD TOMI STUFF
// export var UploadedFiles = new Mongo.Collection("UploadedFiles");
//
// UploadedFiles.attachSchema(new SimpleSchema({
//
//     // Object with all file info
//     fileinfo: {
//       type: Object,
//       optional: false,
//       blackbox: true
//     },
//
//     url: { // Needed since URL-crafting is necessary with a custom ROOT_URL
//       type: String,
//       optional: false
//     }
//   })
// );

