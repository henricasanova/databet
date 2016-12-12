import { Meteor } from 'meteor/meteor';
import { DatabetCollection} from './DatabetCollection';
import { AssessmentItems} from './AssessmentItems';

class CurriculumMappingsCollection extends DatabetCollection {

  remove_document(doc_id, callback) {

    // Removing assessment items for this mapping
    var assessment_items = AssessmentItems.find({curriculum_mapping: doc_id}).fetch();

    for (var i=0; i < assessment_items.length; i++) {
      AssessmentItems.remove_document(assessment_items[i]._id);
    }

    super.remove_document(doc_id, callback);
  }
}


export var CurriculumMappings = new CurriculumMappingsCollection("CurriculumMappings");


CurriculumMappings.attachSchema(new SimpleSchema({
  _id: {
    type: String,
    optional: false
  },
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





