import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DatabetCollection} from './DatabetCollection';
import { PerformanceIndicators} from './PerformanceIndicators';

class StudentOutcomesCollection extends DatabetCollection {

  remove_document(doc_id, callback) {

    // Removing referencing PerformanceIndicators
    var referencing_ids = PerformanceIndicators.get_selected_doc_ids({student_outcome: doc_id});
    _.each(referencing_ids, function(e) { PerformanceIndicators.remove_document(e); });

    super.remove_document(doc_id, callback);

    // Collection-specific: Fix all orders
    var curriculum_id = this.findOne({"_id": doc_id}).curriculum;
    var i;
    var allOutcomes = this.find({"curriculum": curriculum_id}, {sort: {order: 1}}).fetch();
    for (i = 0; i < allOutcomes.length; i++) {
      this.update_document(allOutcomes[i]._id, {"order": i});
    }
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





