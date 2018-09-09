import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DatabetCollection} from './DatabetCollection';
import { AssessmentItems} from './AssessmentItems';

class OfferedCoursesCollection extends DatabetCollection {

  remove_document(doc_id, callback) {

    // Removing referencing AssessmentItems
    var referencing_ids = AssessmentItems.get_selected_doc_ids({offered_course: doc_id});
    _.each(referencing_ids, function(e) { AssessmentItems.remove_document(e); });

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
  toassess: {
    type: Boolean,
    optional: true
  },
  archived: {     // archived by instructor
    type: Boolean,
    optional: false
  }
}));





