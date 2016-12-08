import { Meteor } from 'meteor/meteor';
import { DatabetCollection} from './DatabetCollection';

class StudentOutcomesCollection extends DatabetCollection {

  remove_document(doc_id, callback) {
    console.log("Removing in ", this._name, " (Meteor.client = ", Meteor.client);

    // TODO:  Collection-specific side-removes!!!
    console.log("TODO: Implement implied removes in other collections!!");

    super.remove_document(doc_id, callback);
  }
}


export var StudentOutcomes = new StudentOutcomesCollection("StudentOutcomes");


StudentOutcomes.attachSchema(new SimpleSchema({
  description: {
    type: String,
    optional: false,
  },
  order: {
    type: Number,
    optional: false
  },
  curriculum: {
    type: String,
    optional: false
  }
}));





