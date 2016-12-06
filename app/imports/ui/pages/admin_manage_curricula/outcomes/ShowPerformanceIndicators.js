// import { Template } from 'meteor/templating';
import { PerformanceIndicators } from '../../../../api/databet_collections/PerformanceIndicators';

Template.ShowPerformanceIndicators.onRendered(function () {
    $('.buttonpopup')
      .popup()
    ;
  }
);

Template.ShowPerformanceIndicators.helpers({

  "listOfPerformanceIndicators": function() {
    var outcomeId = Template.currentData().outcomeId;
    return PerformanceIndicators.find({"student_outcome": outcomeId});
  },

  "noPerformanceIndicator": function() {
    var outcomeId = Template.currentData().outcomeId;
    return (!PerformanceIndicators.findOne({"student_outcome": outcomeId}));
  },

  "number_of_pis": function() {
    var outcomeId = Template.currentData().outcomeId;
    var num_pis =PerformanceIndicators.find({"student_outcome": outcomeId}).count();
    return num_pis;
  },

  "is_there_at_least_one_pi": function() {
    var outcomeId = Template.currentData().outcomeId;
    var num_pis =PerformanceIndicators.find({"student_outcome": outcomeId}).count();
    return (num_pis > 0);
  }

});