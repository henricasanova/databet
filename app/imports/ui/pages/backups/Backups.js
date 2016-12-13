import {collection_dictionary} from '../../../startup/both/collection_dictionary.js';
import {Meteor} from 'meteor/meteor';
import {UploadedFiles} from '../../../api/databet_collections/UploadedFiles';
import {insert_bogus_database} from '../../global_helpers/bogus_database';

Template.Backups.onCreated(function () {
  this.reactive_dict = new ReactiveDict();


  Template.instance().reactive_dict.set("zip_file_requested", false);
  Template.instance().reactive_dict.set("download_button_clicked", true);
  Template.instance().reactive_dict.set("waiting_for_download", true);
  Template.instance().reactive_dict.set("waiting_for_upload", false);
  Template.instance().reactive_dict.set("upload_successful", false);
  Template.instance().reactive_dict.set("zip_file_id", null);
  Template.instance().reactive_dict.set("zip_file_url", null);
  Template.instance().reactive_dict.set("download_error", false);
  Template.instance().reactive_dict.set("is_json_parse_error", false);
  Template.instance().reactive_dict.set("json_parse_error", "");
  Template.instance().reactive_dict.set("upload_error", false);
  Template.instance().reactive_dict.set("server_error", "");
  Template.instance().reactive_dict.set("bogus_inserted", false);

});

Template.Backups.onRendered(function () {

  $('.ui.checkbox').checkbox();

});


Template.Backups.helpers({

  "bogus_inserted": function () {
    return Template.instance().reactive_dict.get("bogus_inserted");
  },

  "zip_file_requested": function () {
    return Template.instance().reactive_dict.get("zip_file_requested");
  },

  "waiting_for_server_download": function () {
    return Template.instance().reactive_dict.get("waiting_for_download");
  },

  "archiveUrl": function () {
    return Template.instance().reactive_dict.get("zip_file_url");
  },

  "list_of_collections": function () {
    var list = [];
    for (var p in  collection_dictionary) {
      if (collection_dictionary.hasOwnProperty(p)) {
        list.push(p);
      }
    }
    return list;
  },

  "is_checked_by_default": function () {
    return (this == "Meteor.users" ? "" : "checked");
  },

  "checkbox_id": function () {
    if (this == "Meteor.users") {
      return "Meteorusers";
    } else {
      return this;
    }
  },


"is_json_parse_error": function () {
    return Template.instance().reactive_dict.get("is_json_parse_error");
  },

  "json_parse_error": function () {
    return Template.instance().reactive_dict.get("json_parse_error");
  },

  "upload_successful": function () {
    return Template.instance().reactive_dict.get("upload_successful");
  },

  "upload_error": function () {
    return Template.instance().reactive_dict.get("upload_error");
  },

  "waiting_for_upload": function () {
    return Template.instance().reactive_dict.get("waiting_for_upload");
  },

  "download_button_clicked": function () {
    return Template.instance().reactive_dict.get("download_button_clicked");
  },

  "server_error": function () {
    return Template.instance().reactive_dict.get("server_error");
  },

});


Template.Backups.events({

  "click #button_download_archive": function (e) {

    Template.instance().reactive_dict.set("download_button_clicked", true);
    Template.instance().reactive_dict.set("zip_file_requested", true);

    var reactive_dict = Template.instance().reactive_dict;
    var set_to_true_on_error = "download_error";
    var set_to_id = "zip_file_id";
    var set_to_url = "zip_file_url";
    var set_to_false_when_downloaded = "waiting_for_download";
    var set_to_error = "server_error";

    Meteor.call("download_zipped_backup",
      async function (error, result) {
        if (error) {
          reactive_dict.set(set_to_true_on_error, true);
          reactive_dict.set(set_to_error, error.toString());
        } else {
          // console.log("RESULT = ", result);
          reactive_dict.set(set_to_id, result[0]);
          reactive_dict.set(set_to_url, result[1]);
          reactive_dict.set(set_to_false_when_downloaded, false);
        }
      });
    return false;
  },

  "click #delete_archive": function (e) {
    UploadedFiles.remove_document(Template.instance().reactive_dict.get("zip_file_id"));
    Template.instance().reactive_dict.set("download_button_clicked", false);
  },

  "click #button_upload_json": function (e) {

    Template.instance().reactive_dict.set("is_json_parse_error", false);
    Template.instance().reactive_dict.set("upload_successful", false);

    //Build the list of collections to update
    var list_of_collections_to_update = [];

    for (var p in collection_dictionary) {
      if (collection_dictionary.hasOwnProperty(p)) {
        var checkbox_id = p;
        if (p == "Meteor.users") {
          checkbox_id = "Meteorusers";
        }
        console.log(p, ": ",  $('#' + checkbox_id).is(":checked"));
        if ($('#' + checkbox_id).is(":checked")) {
          list_of_collections_to_update.push(p);
        }
      }
    }

    // Get the JSON string entered by the user
    var json_string = $('#json_to_upload').val();

    // Parse the JSON as a whole, before sending it to the server,
    // just in case it's just poorly formatted
    var data;
    try {
      data = JSON.parse(json_string);
    } catch (e) {
      console.log(e);
      Template.instance().reactive_dict.set("is_json_parse_error",true);
      Template.instance().reactive_dict.set("json_parse_error","<b>JSON PARSE ERROR:</b><br>" + e);
      return false;
    }

    // Check that only valid collections are specified (allow duplicates for now)
    var error_message = "";
    for (var i = 0; i < data.length; i++) {
      var collection_name = data[i][0];
      if (!(collection_name in collection_dictionary)) {
        error_message += "Unknown Collection " + collection_name + "<br>";
      }
    }
    if (error_message != "") {
      Template.instance().reactive_dict.set("is_json_parse_error", true);
      Template.instance().reactive_dict.set("json_parse_error", "<b>JSON PARSE ERROR:</b><br>" + error_message);
      return false;
    }

    // Set the reactive var for the spinner
    Template.instance().reactive_dict.set("waiting_for_upload", true);

    // Send the whole JSON to the server, along with which collections
    // to actual process, and whether to update existing ids or not

    var reactive_dict = Template.instance().reactive_dict;
    var set_to_true_on_error = "upload_error";
    var set_to_false_on_success = "upload_error";
    var set_to_true_on_success = "upload_successful";
    var set_to_false_when_uploaded = "waiting_for_upload";
    var set_to_error = "server_error";

    var update_existing = $('#update_all').is(":checked");

    Meteor.call("import_JSON",
      json_string,
      list_of_collections_to_update,
      update_existing,
      function (error, result) {
        reactive_dict.set(set_to_false_when_uploaded, false);
        if (error) {
          reactive_dict.set(set_to_true_on_error, true);
          reactive_dict.set(set_to_error, error.message);
        } else {
          reactive_dict.set(set_to_false_on_success, false);
          reactive_dict.set(set_to_true_on_success, true);
          reactive_dict.set(set_to_false_when_uploaded, false);
        }
      });
    return false;
  },

  "click #button_insert_bogus": function (e) {
    insert_bogus_database();
    Template.instance().reactive_dict.set("bogus_inserted", true);
    return false;
  }

  });