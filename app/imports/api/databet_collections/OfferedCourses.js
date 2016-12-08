import { Meteor } from 'meteor/meteor';
import { DatabetCollection} from './DatabetCollection';

class OfferedCoursesCollection extends DatabetCollection {

  remove_document(doc_id, callback) {
    console.log("Removing in ", this._name, " (Meteor.client = ", Meteor.client);

    // TODO:  Collection-specific side-removes!!!
    console.log("TODO: Implement implied removes in other collections!!");

    super.remove_document(doc_id, callback);
  }
}

export var OfferedCourses = new OfferedCoursesCollection("OfferedCourses");


OfferedCourses.attachSchema(new SimpleSchema({
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
  archived: {     // archived by instructor
    type: Boolean,
    optional: false
  }
}));





