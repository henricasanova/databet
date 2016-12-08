import { Meteor } from 'meteor/meteor';
import { DatabetCollection} from './DatabetCollection';

class CurriculumMappingsCollection extends DatabetCollection {

  remove_document(doc_id, callback) {
    console.log("Removing in ", this._name, " (Meteor.isClient = ", Meteor.isClient);

    // Not removing of referencing documents

    super.remove_document(doc_id, callback);
  }
}


export var CurriculumMappings = new CurriculumMappingsCollection("CurriculumMappings");


CurriculumMappings.attachSchema(new SimpleSchema({
  curriculum: {
    type: String,
    optional: false
  },
  course: {
    type: String,
    optional: false,
  },
  performance_indicator: {
    type: String,
    optional: false
  },
  level: {
    type: String,
    optional: false
  },
}));





