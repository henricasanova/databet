import {Meteor} from 'meteor/meteor';
import {UploadedFiles} from '../../../api/databet_collections/UploadedFiles';

Template.FileDownload.onCreated(function () {
  this.reactive_dict = new ReactiveDict();

  Template.instance().reactive_dict.set("download_button_clicked", false);
  Template.instance().reactive_dict.set("waiting_for_download", true);
  Template.instance().reactive_dict.set("downloadable_file_id", null);
  Template.instance().reactive_dict.set("downloadable_file_url", null);
  Template.instance().reactive_dict.set("download_error", false);

});

Template.FileDownload.onRendered(function () {

});

Template.FileDownload.helpers({

  "waiting_for_download": function () {
    return Template.instance().reactive_dict.get("waiting_for_download");
  },

  "downloadable_file_url": function () {
    return Template.instance().reactive_dict.get("downloadable_file_url");
  },

  "download_button_clicked": function () {
    return Template.instance().reactive_dict.get("download_button_clicked");
  },

  "download_error": function () {
    return Template.instance().reactive_dict.get("download_error");
  },

  "button_text": function () {
    var button_text = Template.currentData().button_text;
    if (!button_text) {
      button_text = "Download";
    }
    return button_text;
  }

});


Template.FileDownload.events({

  "click #button_download_file": function (e) {

    Template.instance().reactive_dict.set("download_button_clicked", true);

    var reactive_dict = Template.instance().reactive_dict;
    var set_to_true_on_error = "download_error";
    var set_to_id = "downloadable_file_id";
    var set_to_url = "downloadable_file_url";
    var set_to_false_when_downloaded = "waiting_for_download";
    var set_to_error = "download_error";

    // Initiate the download
    Meteor.call(Template.currentData().meteor_method,
      async function (error, result) {
        if (error) {
          reactive_dict.set(set_to_true_on_error, true);
          reactive_dict.set(set_to_error, error.toString());
        } else {
          console.log("RESULT = ", result);
          reactive_dict.set(set_to_id, result[0]);
          reactive_dict.set(set_to_url, result[1]);
          reactive_dict.set(set_to_false_when_downloaded, false);
        }
      });
    return false;
  },

  "click #delete_downloadable_file_on_server": function (e) {
    UploadedFiles.remove_document(Template.instance().reactive_dict.get("downloadable_file_id"));
    Template.instance().reactive_dict.set("download_button_clicked", false);
  },

});