// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import '../../api/databet_collections';
import { collection_dictionary } from '../../startup/both/collection_dictionary';
import { Meteor } from 'meteor/meteor';
import { UploadedFiles } from '../databet_collections/UploadedFiles';
import { meteor_files_config } from '../databet_collections/UploadedFiles';
import { fs_get_file_list } from '../util/file_system';
import { fs_read_file_sync } from '../util/file_system';
import { generic_docs_to_JSON } from '../../ui/global_helpers/collection_to_json';
import { Random } from 'meteor/random';


Meteor.methods({

  download_zipped_backup: function (unused_argument) {

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


});


/***** HELPERS *****/


function collections_2_string() {
  var string = "[ ";

  for (var collection_name in collection_dictionary) {
    if (collection_dictionary.hasOwnProperty(collection_name)) {
      var json_string;
      if (collection_name == "Meteor.users") {
        json_string = generic_docs_to_JSON(Meteor.users.find({}));
      } else {
        json_string = collection_dictionary[collection_name].export_to_JSON();
      }
      string += ' [ "' + collection_name + '" , ' + json_string + " ],";
    }
  }
  string = string.slice(0, -1); // Remove last comma
  string += "]\n";
  return string;
}

