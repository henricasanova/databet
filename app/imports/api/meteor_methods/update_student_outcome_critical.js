// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import { StudentOutcomes } from '../../api/databet_collections/StudentOutcomes';
import { is_so_critical } from '../../api/global_helpers/student_outcome';
import { Meteor } from 'meteor/meteor';

Meteor.methods({

  update_student_outcome_critical: function (student_outcome_id) {
    const student_outcome = StudentOutcomes.findOne({"_id": student_outcome_id});
    const critical = is_so_critical(student_outcome);
    StudentOutcomes.update({"_id": student_outcome_id}, {$set: {"critical": critical}});
    return critical;
  },

});
