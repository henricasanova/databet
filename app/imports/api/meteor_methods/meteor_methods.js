// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import '../../api/databet_collections';
import { collection_dictionary } from '../../startup/both/collection_dictionary';
import { Meteor } from 'meteor/meteor';
import { AssessmentItems } from '../databet_collections/AssessmentItems';
import { Curricula } from '../databet_collections/Curricula';
import { UploadedFiles } from '../databet_collections/UploadedFiles';
import { meteor_files_config } from '../databet_collections/UploadedFiles';
import { fs_move_file_path } from '../util/file_system';
import { fs_get_file_list } from '../util/file_system';
import { fs_read_file_sync } from '../util/file_system';
import { Random } from 'meteor/random';

Meteor.methods({

  insert_document_into_collection: function(collection_name, doc) {

    var collection = collection_dictionary[collection_name];

    if (collection == null) {
      throw new Meteor.Error("Unknown Collection "+collection_name);
    }
    console.log("Inserting new document", doc,"into collection", collection_name);
    collection.insert(doc);
  },

  update_document_in_collection: function(collection_name, doc_id, modifier) {
    var collection = collection_dictionary[collection_name];
    if (collection == null) {
      throw new Meteor.Error("Unknown Collection " + collection_name);
    }
    console.log("Updating document", doc_id, "in collection", collection_name, "modifier = ", modifier);
    collection.update({"_id": doc_id}, {$set: modifier});
  },

  remove_document_from_collection: function(collection_name, doc_id) {
    var collection = collection_dictionary[collection_name];
    if (collection == null) {
      throw new Meteor.Error("Unknown Collection "+collection_name);
    }
    collection.remove({"_id": doc_id});
  },

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

  send_email: function (options) {
    if (Meteor.isServer) {
      Email.send(options);
    }
  },

  download_zipped_backup: function () {

    if (Meteor.server) {

      // Get all files
      var upload_root = meteor_files_config["storagePath"];
      var filelist = fs_get_file_list(upload_root);

      // Construct archive name
      var now = new Date();
      var archive_name = "databet_archive_" +
        (now.getFullYear()) + "_" +
        (now.getMonth() + 1) + "_" +
        (now.getDate()) + "_" +
        (now.getHours()) + "_" +
        (now.getMinutes()) + "_" +
        (now.getSeconds()) + "_" +
        (now.getMilliseconds());

      // Add files to the archive
      var zipfile = new ZipZap();
      for (var i = 0; i < filelist.length; i++) {
        console.log("Archiving ", upload_root + "/" + filelist[i]);
        data = fs_read_file_sync(upload_root + "/" + filelist[i]);
        zipfile.file(archive_name + '/assessment_uploads/' + filelist[i], data);
      }

      // Add the Collection dump to the archive
      zipfile.file(archive_name + "/collections.json", collections_2_string());

      // Add a README to the archive
      zipfile.file(archive_name + "/README.txt", "Snapshot date: " + now.toString() +
        "\n\nThis archive contains:\n\t- this README.txt file\n" +
        "\t- collections.json, which contains a JSON array that contains all collection content, which \n" +
        "can be uploaded back into the collections via the JSON upload feature on the Backup admin page.\n" +
        "\t- an assessment_uploads/ directory, which contains all uploaded files, which on the server\n" +
        "is located in" + upload_root + "/assessment_uploads/\n\n"+
        "** WARNING ** The uploaded files should be put on the server BEFORE using DataBET to re-import\n " +
        "the JSON array\n");

      var archive_path = upload_root + "/" + archive_name + ".zip";
      console.log("Saving archive to: " + archive_path);
      zipfile.saveAs(archive_path);

      var random_key = Random.id();

      UploadedFiles.MeteorFiles.addFile(archive_path,
        {
          fileName: archive_name + ".zip",
          type: 'binary', // not needed
          isBase64: true, // not needed
          meta: {databet_id: random_key}
        },
        function(error, fileRef) {
          // console.log("===>", fileRef);
        }
      );

      // FS-based version (behaves the same, as far as I can tell)
      // var fs = Npm.require("fs");
      // fs.readFile(archive_path,
      //   function(error, data) {
      //     UploadedFiles.MeteorFiles.write(data,
      //       {
      //         fileName: archive_name + ".zip",
      //         isBase64: true,
      //         type: 'binary',
      //         meta: {databet_id: random_key}
      //       }, function (error, fileRef) {
      //         console.log("===>", fileRef);
      //       });
      //   }
      // );


      // Look for the record in a BUSY LOOP (ugly, but fuck callbacks)
      var doc = undefined;
      while (!doc) {
        console.log("In short-lived busy loop");
        doc = UploadedFiles.MeteorFiles.findOne({"meta.databet_id": random_key});
      }

      console.log("URL=", doc.link());
      // console.log("RETURNING", doc.meta.databet_id);
      return [doc.meta.databet_id, doc.link()];
    }
  },

  import_JSON: function (json_string, collections_to_update, update_existing) {
    if (Meteor.isServer) {

      console.log("IN IMPORT JSON");
      // Parse json_string
      var data;
      try {
        data = JSON.parse(json_string);
      } catch (e) {
        throw new Meteor.Error("<b>JSON parse error:</b> <br>" + e);
      }

      var i, j, k;
      var collection_name, collection;

      // Pre-process parse data to deal with the single-entry case
      for (j = 0; j < data.length; j++) {
        if (data[j][1].length === undefined) {
          var tmp = data[j][1];
          data[j][1] = [];
          data[j][1][0] = tmp;
        }
      }

      // Fix possible dates
      for (i = 0; i < collections_to_update.length; i++) {
        for (j = 0; j < data.length; j++) {
          // If not the right collection, skip
          collection_name = data[j][0];
          if (collection_name != collections_to_update[i]) {
            continue;
          }

          for (k = 0; k < data[j][1].length; k++) {
            // fix date
            data[j][1][k] = fix_dates(collection_name, data[j][1][k]);
          }
        }
      }

      // Check that every JSON is ok (we do all this before doing any import)
      console.log("Checking JSON validity...");
      var error_message = "";
      // Go through each collection specification and check validity
      for (i = 0; i < collections_to_update.length; i++) {
        for (j = 0; j < data.length; j++) {
          // If not the right collection, skip
          if (data[j][0] != collections_to_update[i]) {
            continue;
          }

          collection_name = data[j][0];
          collection = collection_dictionary[collection_name];

          try {
            var schema = collection.simpleSchema();
            collection.check_JSON_against_schema(data[j][1], schema);
          } catch (e) {
            error_message += e.toString();
          }
        }
      }

      if (error_message != "") {
        throw new Meteor.Error("<br>"+error_message);
      }

      // Do the import!!
      console.log("Updating collections...");
      for (i = 0; i < collections_to_update.length; i++) {
        for (j = 0; j < data.length; j++) {
          collection_name = data[j][0];
          // If not the right collection, skip
          if (collection_name != collections_to_update[i]) {
            continue;
          }
          console.log("Updating collection ", collection_name);
          collection = collection_dictionary[collection_name];
          try {
            collection.import_from_JSON(data[j][1], update_existing);
          } catch (e) {
            console.log("IM IMPORT FROM JASON GOT EXCEPTION", e.toString());
          }
        }
      }
    }
  },

});


/***** HELPERS *****/


function collections_2_string() {
  var string = "[ ";

  for (var collection_name in collection_dictionary) {
    if (collection_dictionary.hasOwnProperty(collection_name)) {
      string += ' [ "' + collection_name + '" , ' +
        collection_dictionary[collection_name].export_to_JSON() + " ],";
    }
  }
  string = string.slice(0, -1); // Remove last comma
  string += "]\n";
  return string;
}

// Fix dates in documents
function fix_dates(collection_name, doc) {
  try {
    for (var attribute in doc) {
      if (doc.hasOwnProperty(attribute)) {
        if ((collection_name == "AssessmentItems") && (attribute == "date_last_modified")) {
          doc.date_last_modified = new Date(doc.date_last_modified);
        }
        if ((collection_name == "Curricula") && (attribute == "date_created")) {
          doc.date_created = new Date(doc.date_created);
        }
      }
    }
  } catch (e) {
    throw e;
  }
  return doc;
}
