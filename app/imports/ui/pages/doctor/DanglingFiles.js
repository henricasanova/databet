import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { UploadedFiles } from '../../../api/databet_collections/UploadedFiles';
import { object_to_json_html } from '../../../ui/global_helpers/object_to_json';

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
      var original_name = all_uploaded_files[i].name;
      var storage_path = all_uploaded_files[i].path;
      var storage_name_tokens = storage_path.split("/");
      var storage_name = storage_name_tokens[storage_name_tokens.length-1];

      if (Template.instance().list_of_all_files.get().indexOf(storage_name) == -1) {
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
    var original_name = this.name;
    var storage_path = this.path;
    var storage_name_tokens = storage_path.split("/");
    var storage_name = storage_name_tokens[storage_name_tokens.length-1];
    return "Object references unknown file <b>" + storage_name + " </b> " + "(original name: " + original_name;
  },

  object_json: function () {
    return object_to_json_html(this);
  }
});

// function object_to_json(obj) {
//   if (!obj) {
//     return "";
//   }
//   var html_string = "[ ";
//   for (var p in obj) {
//     var value ="";
//     if (typeof(obj[p]) == 'object') {
//       value =  object_to_json(obj[p]);
//     } else {
//       value = obj[p];
//     }
//     html_string += "<b>"+p+"</b>"+":"+value +", ";
//   }
//   html_string += " ]";
//   return html_string;
// }

Template.DanglingFileRow.onRendered(function () {
  $('.buttonpopup')
    .popup({lastResort: 'bottom right'})
  ;
});

//noinspection JSUnusedLocalSymbols
Template.DanglingFileRow.events({

  "click .manage_delete_item": function (e) {
    UploadedFiles.remove_document(this._id); 
    //Meteor.call("delete_from_collection", "UploadedFiles", this._id);
  },

});

