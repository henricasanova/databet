import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { UploadedFiles } from '../../../api/databet_collections/UploadedFiles'

Template.DanglingFiles.onCreated(function () {

  this.download_error = new ReactiveVar();
  this.waiting_for_list_of_all_files = new ReactiveVar();
  this.list_of_all_files = new ReactiveVar();

  Template.instance().waiting_for_list_of_all_files.set(true);
  Template.instance().download_error.set(false);
  Template.instance().list_of_all_files.set([]);

});

Template.DanglingFiles.helpers({

  "construct_list_of_all_files": function () {
    var set_to_false_when_done = Template.instance().waiting_for_list_of_all_files;
    var set_to_true_if_error = Template.instance().download_error;
    var set_to_results = Template.instance().list_of_all_files;

    Meteor.call("get_list_of_uploaded_files", "assessment_uploads", function (error, result) {
      if (error) {
        set_to_true_if_error.set(true);
      } else {
        set_to_results.set(result);
        set_to_false_when_done.set(false);
      }
    });
    return "";
  },

  "list_of_dangling_files": function () {
    var all_uploaded_files = UploadedFiles.find({}).fetch();
    var list = [];
    for (var i = 0; i < all_uploaded_files.length; i++) {
      // console.log("Referenced file ", all_uploaded_files[i].fileinfo.name);
      if (Template.instance().list_of_all_files.get().indexOf(all_uploaded_files[i].fileinfo.name) == -1) {
        list.push(all_uploaded_files[i]);
      }
    }
    return list;
  },

});

Template.DanglingFileRow.helpers({


  doc_id: function () {
    return this._id;
  },

  error_message: function () {
    return "Object references unknown file <b>" + this.fileinfo.name + "</b>";
  },

  object_json: function () {
    return object_to_json(this);
  }
});

function object_to_json(obj) {
  var html_string = "<table>";
  for (var p in obj) {
    if (p == "fileinfo") {
      html_string += "<tr><td>" + p + "</td><td>" + object_to_json(obj[p]) + "</td></tr>\n";
    } else {
      html_string += "<tr><td>" + p + "</td><td>" + obj[p] + "</td></tr>\n";
    }
  }
  html_string += "</table>";
  return html_string;
}

Template.DanglingFileRow.onRendered(function () {
  $('.buttonpopup')
    .popup()
  ;
});

//noinspection JSUnusedLocalSymbols
Template.DanglingFileRow.events({

  "click .manage_delete_item": function (e) {
    Meteor.call("delete_from_collection", "UploadedFiles", this._id);
  },

});

