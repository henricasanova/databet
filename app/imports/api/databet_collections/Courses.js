import { Meteor } from 'meteor/meteor';
import { DatabetCollection} from './DatabetCollection';

class CoursesCollection extends DatabetCollection {

  remove_document(doc_id, callback) {
    console.log("Removing in ", this._name, " (Meteor.client = ", Meteor.client);

    // TODO:  Collection-specific side-removes!!!
    console.log("TODO: Implement implied removes in other collections!!");

    super.remove_document(doc_id, callback);
  }
}


export var Courses = new CoursesCollection("Courses");

Courses.attachSchema(new SimpleSchema({
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





