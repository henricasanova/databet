import { Curricula } from '../../../api/databet_collections/Curricula';
import { StudentOutcomes } from '../../../api/databet_collections/StudentOutcomes';

Template.StatisticsCoverage.onCreated(function () {
  this.heatmap_context = new ReactiveVar();
  var first_curriculum = Curricula.findOne({}, {sort: {date_created: -1}});
  if (first_curriculum) {
    Template.instance().heatmap_context.set(first_curriculum._id);
  } else {
    Template.instance().heatmap_context.set(null);
  }
});

Template.StatisticsCoverage.helpers({

  atLeastOneCurriculum: function() {
    return (Curricula.find({}).count() > 0);
  },

  heatmap_context: function () {
    return Template.instance().heatmap_context;
  },

  so_list: function() {
    return StudentOutcomes.find({curriculum: Template.instance().heatmap_context.get()}).fetch();
  },

  so_description: function() {
    return "<b>SO#" + (this.order+1) + ":</b> " + this.description + "<br>";
  },

});
