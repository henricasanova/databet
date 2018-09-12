import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DatabetCollection} from './DatabetCollection';
import { AssessmentItems} from './AssessmentItems';
import {UploadedFiles} from "./UploadedFiles";

class OfferedCoursesCollection extends DatabetCollection {

  remove_document(doc_id, callback) {

    // Removing referencing AssessmentItems
    var referencing_ids = AssessmentItems.get_selected_doc_ids({offered_course: doc_id});
    _.each(referencing_ids, function(e) { AssessmentItems.remove_document(e); });

    // Remove syllabus if any
    let syllabus_id = OfferedCourses.findOne({"_id": doc_id}).syllabus;
    if (syllabus_id) {
      UploadedFiles.remove_document(syllabus_id);
    }

    super.remove_document(doc_id, callback);
  }
}

export const OfferedCourses = new OfferedCoursesCollection("OfferedCourses");


OfferedCourses.attachSchema(new SimpleSchema({
  _id: {
    type: String,
    optional: false
  },
  course: {
    type: String,
    optional: false,
  },
  semester: {
    type: String,
    optional: false,
  },
  instructor: {
    type: String,
    optional: false
  },
  syllabus: {
    type: String,
    optional: true
  },
  syllabus_compliant: {
    type: String,  // "yes", "no", "tbd"
    optional: true
  },
  toassess: {
    type: Boolean,
    optional: true
  },
  archived: {     // archived by instructor
    type: Boolean,
    optional: false
  }
}));





