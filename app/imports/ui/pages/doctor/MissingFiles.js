import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { UploadedFiles } from '../../../api/databet_collections/UploadedFiles';
import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems';
import { object_to_json_html } from '../../../ui/global_helpers/object_to_json';

Template.MissingFiles.onCreated(function () {

  this.download_error = new ReactiveVar();
  this.waiting_for_list_of_missing_files = new ReactiveVar();
  this.list_of_missing_files = new ReactiveVar();

  Template.instance().waiting_for_list_of_missing_files.set(true);
  Template.instance().download_error.set(false);
  Template.instance().list_of_missing_files.set([]);

});

Template.MissingFiles.helpers({

  "construct_list_of_missing_files": function () {
    var set_to_false_when_done = Template.instance().waiting_for_list_of_missing_files;
    var set_to_true_if_error = Template.instance().download_error;
    var set_to_results = Template.instance().list_of_missing_files;

    // Asynchronous call with callbacks
    Meteor.call("get_list_of_uploaded_files", "assessment_uploads", function (error, result) {
      if (error) {
        set_to_true_if_error.set(true);
      } else {
        var docs = UploadedFiles.find({}).fetch();
        var list_of_missing_files = [];
        for (var i=0; i < docs.length; i++) {
          var filename = docs[i].path.replace(result[0]+"/","");
          if (result.indexOf(filename) == -1) {
            list_of_missing_files.push(docs[i]);
          }
        }
        set_to_results.set(list_of_missing_files);
        set_to_false_when_done.set(false);
      }
    });
    return "";
  },

  "list_of_missing_files": function () {
    return Template.instance().list_of_missing_files.get();
  },

});

Template.MissingFileRow.helpers({

  this_collection: function () {
    return "UploadedFiles";
  },

  this_id: function () {
    return this.meta.databet_id + ": " + this.name;
  },

  object_json: function () {
    return object_to_json_html(this);
  }
});


Template.MissingFileRow.onRendered(function () {
  $('.buttonpopup')
    .popup({lastResort: 'bottom right'})
  ;
});


Template.MissingFileRow.events({

  "click .manage_delete_item": function (e) {
    UploadedFiles.remove_document(this.meta.databet_id);
  },

});
