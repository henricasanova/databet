import { Meteor } from 'meteor/meteor';
import { DatabetCollection} from './DatabetCollection';
import { OfferedCourses} from './OfferedCourses';
import { _ } from 'meteor/underscore';

class SemestersCollection extends DatabetCollection {

  remove_document(doc_id, callback) {
    console.log("Removing in ", this._name, " (Meteor.isClient = ", Meteor.isClient);

    // Removing referencing OfferedCourses
    var referencing_ids = OfferedCourses.get_selected_doc_ids({semester: doc_id});
    _.each(referencing_ids, function(e) { OfferedCourses.remove_document(e); });


    super.remove_document(doc_id, callback);
  }
}

export var Semesters = new SemestersCollection("Semesters");

Semesters.attachSchema(new SimpleSchema({
  session: {
    type: String,
    optional: false,
  },
  year: {
    type: Number,
    optional: false,
  },
  order: {
    type: Number,
    optional: false,
  },
  curriculum: {
    type: String,
    optional: false
  },
  locked: {
    type: Boolean,
    optional: false
  }
}));





