import { Template } from 'meteor/templating';
import {Semesters } from '../../../api/databet_collections/Semesters';
import {semesterdoc_to_semesterstring} from '../../../ui/global_helpers/semesters';

Template.SemesterSelect.helpers({

  listOfSemesters: function () {
    return Semesters.find({}, {sort: {order: -1}});
  },

  some_helper: function() {
    return semesterdoc_to_semesterstring(this);
  }
});

Template.SemesterSelect.events({
  "change .semester_select": function (e, t) {
    // Update the context
    console.log("UPDATE CONTEXT", e.currentTarget.value);
    Template.currentData().context.set(e.currentTarget.value);
  },
});

