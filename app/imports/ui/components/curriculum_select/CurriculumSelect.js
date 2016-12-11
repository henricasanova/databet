import { Template } from 'meteor/templating';
import {Curricula } from '../../../api/databet_collections/Curricula';

Template.CurriculumSelect.helpers({

  listOfCurricula: function () {
    return Curricula.find({}, {sort: {date_created: -1}});
  },

  some_helper: function() {
    return this.description;
  }
});

Template.CurriculumSelect.events({
  "change .curriculum_select": function (e, t) {
    // Update the context
    console.log("UPDATE CONTEXT", e.currentTarget.value);
    Template.currentData().context.set(e.currentTarget.value);
  },
});

