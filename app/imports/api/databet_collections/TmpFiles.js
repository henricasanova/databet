/*
 * THIS IS NOT A BASE MONGO COLLECTION - IT'S A METEOR-FILES COLLECTION
 */


import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { fs_create_dir, fs_remove_dir } from '../global_helpers/file_system';
import { FilesCollection } from 'meteor/ostrio:files';


export class TmpFilesCollection {

  constructor(config) {
    this.config = config;
    this.MeteorFiles = new FilesCollection(config);
  }

  get_storage_path() {
    return this.config["storagePath"];
  }

  remove_document(databet_id) {
    console.log("Removing in TmpFiles");
    this.MeteorFiles.remove({"meta.databet_id": databet_id});
  }

  remove_all() {
    console.log("Removing ALL in TmpFiles");
    this.MeteorFiles.remove({});
  }
}


const meteor_files_config = {};

if (Meteor.server) {

  var upload_root = Meteor.settings.upload_dir.path;
  if (upload_root == undefined) {
    throw new Meteor.Error("upload_dir should be defined in the settings file");
  }


  meteor_files_config["storagePath"] = upload_root + "/tmp/";
  fs_remove_dir(meteor_files_config["storagePath"]);
  fs_create_dir(meteor_files_config["storagePath"]);

}

meteor_files_config["debug"] = false;
meteor_files_config["collectionName"] = 'TmpFiles';
meteor_files_config["allowClientCode"] = true;  // to allow file removal

export const TmpFiles = new TmpFilesCollection(meteor_files_config);

