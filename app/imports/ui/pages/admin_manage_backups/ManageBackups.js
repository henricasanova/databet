import { collection_dictionary } from '../../../startup/both/collection_dictionary.js';
import { Meteor } from 'meteor/meteor';

Template.ManageBackups.onCreated(function () {
  this.zip_file_requested = new ReactiveVar();
  this.waiting_for_download = new ReactiveVar();
  this.waiting_for_upload = new ReactiveVar();
  this.upload_successful = new ReactiveVar();
  this.zip_file_url = new ReactiveVar();
  this.download_error = new ReactiveVar();
  this.is_json_parse_error = new ReactiveVar();
  this.json_parse_error = new ReactiveVar();
  this.upload_error = new ReactiveVar();
  this.server_error = new ReactiveVar();

  Template.instance().zip_file_requested.set(false);
  Template.instance().waiting_for_download.set(true);
  Template.instance().waiting_for_upload.set(false);
  Template.instance().upload_successful.set(false);
  Template.instance().zip_file_url.set(null);
  Template.instance().download_error.set(false);
  Template.instance().is_json_parse_error.set(false);
  Template.instance().json_parse_error.set("");
  Template.instance().upload_error.set(false);
  Template.instance().server_error.set("");
});

Template.ManageBackups.onRendered(function () {

  $('.ui.checkbox').checkbox();

});


Template.ManageBackups.helpers({

  "zip_file_requested": function () {
    return Template.instance().zip_file_requested.get();
  },

  "waiting_for_server_download": function () {
    return Template.instance().waiting_for_download.get();
  },

  "zip_file_url": function () {
    return Template.instance().zip_file_url.get();
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

  "is_json_parse_error": function () {
    return Template.instance().is_json_parse_error.get();
  },

  "json_parse_error": function () {
    return Template.instance().json_parse_error.get();
  },

  "upload_successful": function () {
    return Template.instance().upload_successful.get();
  },

  "upload_error": function () {
    return Template.instance().upload_error.get();
  },

  "waiting_for_upload": function () {
    return Template.instance().waiting_for_upload.get();
  },

  "server_error": function () {
    return Template.instance().server_error.get();
  },


});


Template.ManageBackups.events({

  "click #button_download_archive": function (e) {

    Template.instance().zip_file_requested.set(true);

    var set_to_true_on_error = Template.instance().download_error;
    var set_to_url = Template.instance().zip_file_url;
    var set_to_false_when_downloaded = Template.instance().waiting_for_download;
    var set_to_error = Template.instance().server_error;

    Meteor.call("download_zipped_backup",
      function (error, result) {
        if (error) {
          set_to_true_on_error.set(true);
          set_to_error.set(error);
        } else {
          // NOTE THE USE OF Meteor.absoluteUrl (to handle custom ROOT_URL)
          set_to_url.set(Meteor.absoluteUrl(result));
          set_to_false_when_downloaded.set(false);
        }
      });
    return false;
  },

  "click #button_upload_json": function (e) {

    Template.instance().is_json_parse_error.set(false);
    Template.instance().upload_successful.set(false);

    //Build the list of collections to update
    var list_of_collections_to_update = [];

    for (var p in collection_dictionary) {
      if (collection_dictionary.hasOwnProperty(p)) {
        if ($('#' + p).is(":checked")) {
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
      Template.instance().is_json_parse_error.set(true);
      Template.instance().json_parse_error.set("<b>JSON PARSE ERROR:</b><br> " + e);
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
      Template.instance().is_json_parse_error.set(true);
      Template.instance().json_parse_error.set("<b>JSON PARSE ERROR:</b><br> " + error_message);
      return false;
    }

    // Set the reactive var for the spinner
    Template.instance().waiting_for_upload.set(true);

    // Send the whole JSON to the server, along with which collections
    // to actual process, and whether to update existing ids or not

    var set_to_true_on_error = Template.instance().upload_error;
    var set_to_false_on_success = Template.instance().upload_error;
    var set_to_true_on_success = Template.instance().upload_successful;
    var set_to_false_when_uploaded = Template.instance().waiting_for_upload;
    var set_to_error = Template.instance().server_error;

    var update_existing = $('#update_all').is(":checked");


    Meteor.call("import_JSON",
      json_string,
      list_of_collections_to_update,
      update_existing,
      function (error, result) {
        set_to_false_when_uploaded.set(false);
        if (error) {
          set_to_true_on_error.set(true);
          set_to_error.set(error);
        } else {
          set_to_false_on_success.set(false);
          set_to_true_on_success.set(true);
          set_to_false_when_uploaded.set(false);
        }
      });

    return false;

  }

});