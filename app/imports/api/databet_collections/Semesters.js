import { Meteor } from 'meteor/meteor';
import { DatabetCollection} from './DatabetCollection';

class SemestersCollection extends DatabetCollection {

  remove_document(doc_id, callback) {
    console.log("Removing in ", this._name, " (Meteor.client = ", Meteor.client);

    // TODO:  Collection-specific side-removes!!!
    console.log("TODO: Implement implied removes in other collections!!");

    super.remove_document(doc_id, callback);
  }
}

console.log("CALLING CONSTRUCTOR");
export var Semesters = new SemestersCollection("Semesters");
console.log("CALLED CONSTRUCTOR");


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





