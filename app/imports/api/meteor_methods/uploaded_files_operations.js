// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import '../../api/databet_collections';
import { Meteor } from 'meteor/meteor';
import { UploadedFiles } from '../databet_collections/UploadedFiles';
import { meteor_files_config } from '../databet_collections/UploadedFiles';
import { fs_move_file_path } from '../util/file_system';
import { fs_get_file_list } from '../util/file_system';
import { Random } from 'meteor/random';


Meteor.methods({

  get_list_of_uploaded_files: function () {

    if (Meteor.isServer) {

      // The is an ugly way to get the config back
      var dir = meteor_files_config["storagePath"];

      var list = fs_get_file_list(dir);
      list.unshift(dir); // Add the directory itself as the first element of the list (total hack)
      return list;
    }
  },

  rename_uploaded_file: function(doc_id, new_path) {
    var doc = UploadedFiles.MeteorFiles.findOne({"_id": doc_id});
    if (!doc) { return; }

    //console.log(doc);
    var old_path = doc.path;

    //console.log("Should mv ", old_path, " ", new_path);

    // Update the collection
    var modifier = {"path": new_path, "versions.original.path": new_path };
    //console.log("MODIFIER = ", modifier);
    UploadedFiles.MeteorFiles.update({"_id": doc._id}, {$set: modifier});
    //console.log("UPDATED:", UploadedFiles.MeteorFiles.findOne({"_id": doc._id}));

    // Update the file system
    fs_move_file_path(old_path, new_path);
  },

});
