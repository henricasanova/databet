import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DatabetCollection} from './DatabetCollection';
import { Semesters} from './Semesters';
import { StudentOutcomes} from './StudentOutcomes';
import { Courses} from './Courses';
import { CurriculumMappings} from './CurriculumMappings';

class CurriculaCollection extends DatabetCollection {

  remove_document(doc_id, callback) {

    // Removing referencing Semesters
    var referencing_ids = Semesters.get_selected_doc_ids({curriculum: doc_id});
    _.each(referencing_ids, function(e) { Semesters.remove_document(e); });
    // Removing referencing StudentOutcomes
    referencing_ids = StudentOutcomes.get_selected_doc_ids({curriculum: doc_id});
    _.each(referencing_ids, function(e) { StudentOutcomes.remove_document(e); });
    // Removing referencing Courses
    referencing_ids = Courses.get_selected_doc_ids({curriculum: doc_id});
    _.each(referencing_ids, function(e) { Courses.remove_document(e); });
    // Removing referencing CurriculumMappings
    referencing_ids = CurriculumMappings.get_selected_doc_ids({curriculum: doc_id});
    _.each(referencing_ids, function(e) { CurriculumMappings.remove_document(e); });


    super.remove_document(doc_id, callback);
  }
}


export const Curricula = new CurriculaCollection("Curricula");


Curricula.attachSchema(new SimpleSchema({
  _id: {
    type: String,
    optional: false
  },
  description: {
    type: String,
    optional: false,
  },
  date_created: {
    type: Date,
    optional: false
  },
  locked: {
    type: Boolean,
    optional: false
  }
}));





