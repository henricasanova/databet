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
  Template.currentData().context.final_state.file = null;
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
      console.log("LOOKING FOR A PREVIOUSLY UPLOADED FILE");
      var found_file = UploadedFiles.findOne({"meta": {"databet_id": previously_uploaded_file_id}});
      console.log("FOUND FILE: ", found_file);
      console.log("SHOULD RETURN URL!!!", found_file.link());
      return found_file.link();
      //return UploadedFiles.findOne({"_id": previously_uploaded_file_id}).url;
    } else {
      return "";
    }
  },

  // "file_upload_callbacks": function () {
  //   return my_file_upload_callbacks();
  // }

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

    // Update missing content var for text
    Template.currentData().context.missing_text_reactive_var.set(false);

    // Update final state
    Template.currentData().context.final_state.is_file = true;
    Template.currentData().context.final_state.file = null;

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
    Template.currentData().context.final_state.file = null;
  },

  "change #fileInput": function (e) {
    console.log("New file selection");
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      Template.currentData().context.final_state.file = e.currentTarget.files[0];
      Template.currentData().context.missing_file_reactive_var.set(false);
    } else {
      Template.currentData().context.missing_file_reactive_var.set(true);
    }
  },

});

