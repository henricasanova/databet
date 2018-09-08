import { Meteor } from 'meteor/meteor';
import { UploadedFiles } from '../../../api/databet_collections/UploadedFiles';
import { Random } from 'meteor/random';


Template.UploadFile.onCreated(function () {

  // To remember text
  this.current_text_area_value = new ReactiveVar();
  Template.instance().current_text_area_value.set(Template.currentData().context.initial_text);


});

Template.UploadFile.helpers({

  "my_name": function () {
    return Template.currentData().context.my_name;
  },

  "missing_file": function () {
    return (Template.currentData().context.previously_uploaded_file.get() === "");
  },

  "previously_uploaded_file_exists": function () {
    return (Template.currentData().context.previously_uploaded_file.get() != undefined);
  },

  "previously_uploaded_file_is_valid": function() {
    let previously_uploaded_file_id = Template.currentData().context.previously_uploaded_file.get();
    if (previously_uploaded_file_id) {
      var found_file = UploadedFiles.findOne({"meta": {"databet_id": previously_uploaded_file_id}});
      if (found_file) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  "previously_uploaded_file_url": function () {
    let previously_uploaded_file_id = Template.currentData().context.previously_uploaded_file.get();

    if (previously_uploaded_file_id != null) {
      var found_file = UploadedFiles.findOne({"meta": {"databet_id": previously_uploaded_file_id}});
      if (found_file) {
        return found_file.link();
      } else {
        return "BROKEN";
      }
    } else {
      return "";
    }
  },

  // "file_upload_callbacks": function () {
  //   return my_file_upload_callbacks();
  // }

});

Template.UploadFile.events({

  "change #fileinput": function (e) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      Template.currentData().context.most_recently_selected_file_path.set(e.currentTarget.files[0]);
    }
  },

});

