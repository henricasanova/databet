import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DatabetCollection} from './DatabetCollection';
import { PerformanceIndicators} from './PerformanceIndicators';

class StudentOutcomesCollection extends DatabetCollection {

  remove_document(doc_id, callback) {

    // Removing referencing PerformanceIndicators
    const referencing_ids = PerformanceIndicators.get_selected_doc_ids({student_outcome: doc_id});
    _.each(referencing_ids, function(e) { PerformanceIndicators.remove_document(e); });

    const curriculum_id = this.findOne({"_id": doc_id}).curriculum;

    super.remove_document(doc_id, callback);

    // Collection-specific: Fix all orders
    const allOutcomes = this.find({"curriculum": curriculum_id}, {sort: {order: 1}}).fetch();
    for (let i = 0; i < allOutcomes.length; i++) {
      this.update_document(allOutcomes[i]._id, {"order": i});
    }
  }
}

export const StudentOutcomes = new StudentOutcomesCollection("StudentOutcomes");

StudentOutcomes.attachSchema(new SimpleSchema({
  _id: {
    type: String,
    optional: false
  },
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
  },
  critical: {
    type: Boolean,
    optional: false
  },
}));





