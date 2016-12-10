import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DatabetCollection} from './DatabetCollection';
import { OfferedCourses } from './OfferedCourses';
import { CurriculumMappings} from './CurriculumMappings';

class CoursesCollection extends DatabetCollection {

  remove_document(doc_id, callback) {

    // Removing referencing OfferedCourses
    var referencing_ids = OfferedCourses.get_selected_doc_ids({course: doc_id});
    _.each(referencing_ids, function(e) { OfferedCourses.remove_document(e); });
    // Removing referencing CurriculumMappings
    referencing_ids = CurriculumMappings.get_selected_doc_ids({course: doc_id});
    _.each(referencing_ids, function(e) { CurriculumMappings.remove_document(e); });


    super.remove_document(doc_id, callback);
  }
}


export var Courses = new CoursesCollection("Courses");

Courses.attachSchema(new SimpleSchema({
  _id: {
    type: String,
    optional: false
  },
  alphanumeric: {
    type: String,
    optional: false,
  },
  title: {
    type: String,
    optional: false,
  },
  curriculum: {
    type: String,
    optional: false
  }
}));





