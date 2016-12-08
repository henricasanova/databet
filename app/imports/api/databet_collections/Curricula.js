import { Meteor } from 'meteor/meteor';
import { DatabetCollection} from './DatabetCollection';

class CurriculaCollection extends DatabetCollection {

  remove_document(doc_id, callback) {
    console.log("Removing in ", this._name, " (Meteor.isClient = ", Meteor.isClient);

    // TODO:  Collection-specific side-removes!!!
    console.log("TODO: Implement implied removes in other collections!!");

    super.remove_document(doc_id, callback);
  }
}


export var Curricula = new CurriculaCollection("Curricula");


Curricula.attachSchema(new SimpleSchema({
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





