/*
 * THIS IS NOT A BASE MONGO COLLECTION - IT'S A METEOR-FILES COLLECTION
 */


import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { fs_create_dir } from '../util/file_system';

export var meteor_files_config = {};

if (Meteor.server) {

  var upload_root = process.env.UPLOAD_DIR;
  if (upload_root == undefined) {
    throw new Meteor.Error("UPLOAD_DIR environment variable must be defined");
  }

  // console.log("Creating Directory " + upload_root + "/assessment_uploads/ ...");
  fs_create_dir(upload_root + "/assessment_uploads/");

  meteor_files_config["storagePath"] = upload_root + "/assessment_uploads/";
  console.log("storage path =", meteor_files_config["storagePath"]);
}

meteor_files_config["debug"] = false;
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

export class UploadedFilesCollection {

  constructor(config) {
    this.MeteorFiles = new Meteor.Files(config);
  }

  insert_document(fileObj, databet_id, prefix) {
    var uploadInstance = this.MeteorFiles.insert({
      file: fileObj,
      meta: { "databet_id": databet_id },
      streams: 'dynamic',
      chunkSize: 'dynamic'
    }, false);

    uploadInstance.on('start', function() {
      // nothing
    });

    uploadInstance.on('end', function(error, fileObj) {
      if (error) {
        alert('Error during upload: ' + error.reason);
      } else {
        alert('File "' + fileObj.name + '" successfully uploaded');
        // This is a terrible hack to impose particular filenames in Meteor-Files
        //console.log("Should try to rename File: fileObj", fileObj);
        var search_pattern = new RegExp(fileObj._id, "g");
        var replace_with = prefix + "::" + fileObj._id;
        var new_path = fileObj.path.replace(search_pattern, replace_with);
        Meteor.call("rename_uploaded_file", fileObj._id, new_path);
      }
    });

    uploadInstance.start();
  }

  remove_document(databet_id) {
    console.log("Removing in UploadFiles");
    this.MeteorFiles.remove({"meta.databet_id": databet_id});
  }

  remove(selector) {
    return this.MeteorFiles.remove(selector);
  }

  find(selector) {
    return this.MeteorFiles.find(selector);
  }

  findOne(selector) {
    return this.MeteorFiles.findOne(selector);
  }
}


export var UploadedFiles = new UploadedFilesCollection(meteor_files_config);

