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

        // console.log("RESULT = ", result);

        var list_of_known_files = UploadedFiles.find({}).fetch();
        var list_of_known_filenames = [];
        for (var i=0; i < list_of_known_files.length; i++) {
          list_of_known_filenames.push(list_of_known_files[i].path.replace(result[0]+"/",""));
        }

        // console.log("LIST OF KNOWN FILENAMES = ", list_of_known_filenames);

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

