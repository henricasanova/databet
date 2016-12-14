/*
 * THIS IS NOT A BASE MONGO COLLECTION - IT'S A METEOR-FILES COLLECTION
 */


import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { fs_create_dir } from '../global_helpers/file_system';


export class TmpFilesCollection {

  constructor(config) {
    this.config = config;
    this.MeteorFiles = new Meteor.Files(config);
  }

  get_storage_path() {
    return this.config["storagePath"];
  }

  remove_document(databet_id) {
    console.log("Removing in TmpFiles");
    this.MeteorFiles.remove({"meta.databet_id": databet_id});
  }

}


var meteor_files_config = {};

if (Meteor.server) {

  var upload_root = process.env.UPLOAD_DIR;
  if (upload_root == undefined) {
    throw new Meteor.Error("UPLOAD_DIR environment variable must be defined");
  }


  meteor_files_config["storagePath"] = upload_root + "/tmp/";
  fs_create_dir(meteor_files_config["storagePath"]);

}

meteor_files_config["debug"] = false;
meteor_files_config["collectionName"] = 'TmpFiles';
meteor_files_config["allowClientCode"] = true;  // to allow file removal

export var TmpFiles = new TmpFilesCollection(meteor_files_config);


