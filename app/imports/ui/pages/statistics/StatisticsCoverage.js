import { Curricula } from '../../../api/databet_collections/Curricula';

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

});
