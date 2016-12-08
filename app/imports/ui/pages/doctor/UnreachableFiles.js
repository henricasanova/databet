import { Meteor } from 'meteor/meteor';
import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems';
import { UploadedFiles } from '../../../api/databet_collections/UploadedFiles';

Template.UnreachableFiles.onCreated(function () {
  this.download_error = new ReactiveVar();
  this.waiting_for_list_of_unreachable_assessment_files = new ReactiveVar();
  this.list_of_unreachable_assessment_files = new ReactiveVar();

  Template.instance().download_error.set(false);
  Template.instance().waiting_for_list_of_unreachable_assessment_files.set(true);
  Template.instance().list_of_unreachable_assessment_files.set([]);
});

Template.UnreachableFiles.helpers({

  "waiting_for_list_of_unreachable_assessment_files": function () {
    return Template.instance().waiting_for_list_of_unreachable_assessment_files.get();
  },

  "list_of_unreachable_assessment_files": function () {
    return Template.instance().list_of_unreachable_assessment_files.get();
  },

  "construct_list_of_unreachable_assessment_files": function () {
    var set_to_false_when_done = Template.instance().waiting_for_list_of_unreachable_assessment_files;
    var set_to_true_if_error = Template.instance().download_error;
    var set_to_results = Template.instance().list_of_unreachable_assessment_files;

    // Asynchronous call with callbacks
    Meteor.call("get_list_of_uploaded_files", "assessment_uploads", function (error, result) {
      if (error) {
        set_to_true_if_error.set(true);
      } else {

        // Build the list of known filenames (note that we don't simply looked at the UploadedFiles collection)
        var list_of_assessment_items = AssessmentItems.find({}).fetch();
        var list_of_known_filenames = [];
        for (var i = 0; i < list_of_assessment_items.length; i++) {
          var file_fields = ["assessment_question_file", "sample_poor_answer_file", "sample_medium_answer_file", "sample_good_answer_file"];
          for (var j = 0; j < file_fields.length; j++) {
            if (list_of_assessment_items[i][file_fields[j]]) {
              var uploaded_file = UploadedFiles.findOne({"meta": {"databet_id": list_of_assessment_items[i][file_fields[j]]}});
              if (uploaded_file) {
                var original_name = uploaded_file.name;
                var storage_path = uploaded_file.path;
                var storage_name_tokens = storage_path.split("/");
                var storage_name = storage_name_tokens[storage_name_tokens.length-1];
                list_of_known_filenames.push(storage_name);
              }
            }
          }
        }


        // Build list of unreachable filenames
        var list_of_unreachable_filenames = [];
        for (var j = 1; j < result.length; j++) {
          if (list_of_known_filenames.indexOf(result[j]) < 0) {
            list_of_unreachable_filenames.push(result[0] + result[j]);
          } else {
          }
        }
        set_to_results.set(list_of_unreachable_filenames);
        set_to_false_when_done.set(false);
      }
    });
    return "";
  },

});


// Template.UnreachableFiles.events({
//
//   "click .delete_file": function () {
//
//     Meteor.call("bruteforce_remove_uploaded_file", this.valueOf());
//
//     // Could not get list.splice to work!
//     var old_list = Template.instance().list_of_unreachable_assessment_files.get();
//     var new_list = [];
//     for (var i = 0; i < old_list.length; i++) {
//       if (old_list[i] != this.valueOf()) {
//         new_list.push(old_list[i]);
//       }
//     }
//     Template.instance().list_of_unreachable_assessment_files.set(new_list);
//
//   }
//
// });


