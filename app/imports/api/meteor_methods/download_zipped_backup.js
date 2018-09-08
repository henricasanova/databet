// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import '../../api/databet_collections';
import { collection_dictionary } from '../../startup/both/collection_dictionary';
import { Meteor } from 'meteor/meteor';
import { fs_get_file_list } from '../global_helpers/file_system';
import { fs_read_file_sync } from '../global_helpers/file_system';
import { generic_docs_to_JSON } from '../global_helpers/collection_to_json';
import { save_and_publish_zipfile} from '../global_helpers/downloadable_zipfile';
import { Random } from 'meteor/random';
import { UploadedFiles } from '../../api/databet_collections/UploadedFiles';

Meteor.methods({

  download_zipped_backup: function (unused_argument) {

    if (Meteor.server) {

      // Get all files
      var upload_root = UploadedFiles.get_storage_path();
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

      var id_and_url = save_and_publish_zipfile(zipfile, archive_name);
      return id_and_url;

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

