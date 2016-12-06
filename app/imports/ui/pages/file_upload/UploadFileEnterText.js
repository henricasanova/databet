import { Meteor } from 'meteor/meteor';
import { UploadedFiles } from '../../../api/databet_collections/UploadedFiles';
import { Random } from 'meteor/random';

Template.UploadFileEnterText.onCreated(function () {

  this.upload_method_is_file = new ReactiveVar();
  this.upload_method_is_text = new ReactiveVar();

  if (Template.currentData().context.action == "add") {

    Template.instance().upload_method_is_file.set(true);
    Template.instance().upload_method_is_text.set(false);

  } else {

    Template.instance().upload_method_is_file.set(
      Template.currentData().context.initial_method_is_file);
    Template.instance().upload_method_is_text.set(
      !(Template.currentData().context.initial_method_is_file));

  }

  // console.log("CONTEXT: ", Template.currentData().context);

  // Set final to initial (since we may not change anything)
  Template.currentData().context.final_state.is_file = Template.currentData().context.initial_method_is_file;
  Template.currentData().context.final_state.file_id = null;
  Template.currentData().context.final_state.fileinfo = null;
  Template.currentData().context.final_state.text_area_id = Template.currentData().context.text_area_id;

  // To remember text
  this.current_text_area_value = new ReactiveVar();
  Template.instance().current_text_area_value.set(Template.currentData().context.initial_text);


});

Template.UploadFileEnterText.helpers({

  "is_add": function () {
    return (Template.currentData().context.action == "add");
  },

  "is_update": function () {
    return (Template.currentData().context.action == "update");
  },

  "my_name": function () {
    return Template.currentData().context.my_name;
  },

  "upload_method_is_file": function () {
    return Template.instance().upload_method_is_file.get();
  },

  "upload_method_is_text": function () {
    return Template.instance().upload_method_is_text.get();
  },

  "initial_method_is_file": function () {
    return Template.currentData().context.initial_method_is_file;
  },

  "initial_method_is_text": function () {
    return !Template.currentData().context.initial_method_is_file;
  },

  "missing_text": function () {
    return Template.currentData().context.missing_text_reactive_var.get();
  },

  "missing_file": function () {
    return Template.currentData().context.missing_file_reactive_var.get();
  },

  "current_text_area_value": function () {
    return Template.instance().current_text_area_value.get();
  },

  "text_area_id": function () {
    return Template.currentData().context.text_area_id;
  },

  "previously_uploaded_file_exists": function () {
    return (Template.currentData().context.initial_file != null);
  },

  "previously_uploaded_file_url": function () {
    var previously_uploaded_file_id = Template.currentData().context.initial_file;
    if (previously_uploaded_file_id != null) {
      return UploadedFiles.findOne({"_id": previously_uploaded_file_id}).url;
    } else {
      return "";
    }
  },

  "file_upload_callbacks": function () {
    return my_file_upload_callbacks();
  }

});

Template.UploadFileEnterText.events({

  "keydown .text_area": function (e) {
    Template.currentData().context.missing_text_reactive_var.set(false);
    return true;
  },

  "change .upload_method_file": function (e) {

    // Save old text
    Template.instance().current_text_area_value.set($('#' + Template.currentData().context.final_state.text_area_id).val());

    Template.instance().upload_method_is_file.set(true);
    Template.instance().upload_method_is_text.set(false);
    if (Template.instance().uploaded_file) {
      Meteor.call("remove_uploaded_file", Template.instance().uploaded_file.path);
    }
    Template.instance().uploaded_file = null;
    Template.instance().uploaded_file_id = null;

    // Update missing content var for text
    Template.currentData().context.missing_text_reactive_var.set(false);

    // Update final state
    Template.currentData().context.final_state.is_file = true;
    Template.currentData().context.final_state.fileinfo = null;
    Template.currentData().context.final_state.file_id = null;

  },

  "change .upload_method_text": function (e) {

    Template.instance().upload_method_is_text.set(true);
    Template.instance().upload_method_is_file.set(false);

    // Put text back in because it disappeared
    Template.instance().current_text_area_value.set(Template.instance().current_text_area_value.get());

    // Update missing content var for file
    Template.currentData().context.missing_file_reactive_var.set(false);

    // Update final state
    Template.currentData().context.final_state.is_file = false;
    Template.currentData().context.final_state.fileinfo = null;
    Template.currentData().context.final_state.file_id = null;
  },

});

// Generic-ish callback for file upload

function my_file_upload_callbacks() {

  var set_to_false_when_uploaded = Template.currentData().context.missing_file_reactive_var;
  var file_info_bookkeeping = Template.currentData().context.final_state;

  return {
    formData: function () {

      // set the id
      var uploaded_file_id = Random.id();
      file_info_bookkeeping.file_id = uploaded_file_id;

      return {
        directoryName: 'assessment_uploads',
        prefix: uploaded_file_id
      };
    },

    finished: function (index, fileInfo, context) {

      // There was already an image, so I remove it
      if (file_info_bookkeeping.fileinfo) {
        Meteor.call("remove_uploaded_file", file_info_bookkeeping.fileinfo.path);
      }
      file_info_bookkeeping.fileinfo = fileInfo;

      if (set_to_false_when_uploaded) {
        set_to_false_when_uploaded.set(false);
      }
    }
  }
}

