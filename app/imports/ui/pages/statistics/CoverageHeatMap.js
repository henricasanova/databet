import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {semesterdoc_to_semesterstring} from '../../../ui/global_helpers/semesters';
import {StudentOutcomes} from '../../../api/databet_collections/StudentOutcomes';
import {Semesters} from '../../../api/databet_collections/Semesters';
import {AssessmentItems} from '../../../api/databet_collections/AssessmentItems';
import {OfferedCourses} from '../../../api/databet_collections/OfferedCourses';
import {CurriculumMappings} from '../../../api/databet_collections/CurriculumMappings';
import {PerformanceIndicators} from '../../../api/databet_collections/PerformanceIndicators';

var Highcharts = require('highcharts');

// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);

Template.CoverageHeatMap.onRendered(function () {
    $('.buttonpopup')
      .popup()
    ;
  }
);


Template.CoverageHeatMap.helpers({

  canShowHeatMap: function() {
    var so_list = get_so_list(Template.currentData().context.get());
    var semester_list = get_semester_list(Template.currentData().context.get());
    return ((so_list.length > 0) && (semester_list.length >0));
  },

  createHeatMap: function () {
    // Get the lists
    var so_list = get_so_list(Template.currentData().context.get());
    var semester_list = get_semester_list(Template.currentData().context.get());
    var coverage_data = get_coverage_data(Template.currentData().context.get());

    semester_list.push("<b>TOTAL</b>");

    var total_counts =[];
    for (var i=0; i < so_list.length; i++) {
      total_counts.push(0);
    }

    for (var i=0; i < coverage_data.length; i++) {
      var data_item = coverage_data[i];
      total_counts[data_item[1]] += data_item[2];
    }

    for (var i=0; i < so_list.length; i++) {
      coverage_data.push([semester_list.length-1, i, total_counts[i].toString()]);
      // coverage_data.push([semester_list.length-1, i, "string"]);
    }

    // console.log("so_list ===>", so_list.toString());
    // console.log("semester_list ===>", semester_list.toString());
    // console.log("coverage_data ===>", coverage_data.toString());

    // Use Meteor.defer() to create chart after DOM is ready:
    Meteor.defer(function() {
      // Create standard Highcharts chart with options:

      Highcharts.chart('chart', {

        chart: {
          type: 'heatmap',
          marginTop: 40,
          marginBottom: 80,
          plotBorderWidth: 1
        },

        title: {
          text: ''
        },

        xAxis: {
          allowDecimals: false,
          categories: semester_list,
          labels: {
            rotation: -90
          }
        },

        yAxis: {
          allowDecimals: false,
          categories: so_list,
          title: null,

        },

        colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: Highcharts.getOptions().colors[0]
        },

        legend: {
          align: 'right',
          layout: 'vertical',
          margin: 0,
          verticalAlign: 'top',
          y: 25,
          symbolHeight: 280
        },

        tooltip: {
          // formatter: function () {
          //   return '<b>' + this.point.value + "</b> assessment items entered<br> for <b>" +
          //     this.series.yAxis.categories[this.point.y] +
          //     '</b> for semester <br><b>' +
          //     this.series.xAxis.categories[this.point.x] + '</b>';
          // }
          enabled: false
        },

        series: [{
          name: 'n/a',
          borderWidth: 2,
          allowDecimals: false,
          data: coverage_data,
          dataLabels: {
            enabled: true,
            color: '#000000'
          }
        }]

      });
    });
  }
});


function get_so_list(curriculum_id) {
  var so_list = StudentOutcomes.find({curriculum: curriculum_id}).fetch();
  return _.map(so_list, function(e) {return "SO#"+(e.order+1);});
}


function get_semester_list(curriculum_id) {
  var semester_list = Semesters.find({curriculum: curriculum_id}).fetch();
  return _.map(semester_list, function(e) {return semesterdoc_to_semesterstring(e)})
}

function get_coverage_data(curriculum_id) {
  var so_list = StudentOutcomes.find({curriculum: curriculum_id}).fetch();
  var semester_list = Semesters.find({curriculum: curriculum_id}).fetch();

  var data=[];
  for (var j=0; j < semester_list.length; j++) {
    for (var i=0; i < so_list.length; i++) {
      data.push([j, i, num_relevant_assessment_items(so_list[i], semester_list[j])]);
    }
  }
  return data;
}

function num_relevant_assessment_items(student_outcome, semester) {

  var offered_courses = OfferedCourses.find({"semester": semester._id}).fetch();
  var count = 0;

  for (var i=0; i < offered_courses.length; i++) {
    // console.log("Looking at offered course ", offered_courses[i]);
    var assessment_items = AssessmentItems.find({"offered_course": offered_courses[i]._id}).fetch();
    for (var j=0; j < assessment_items.length; j++) {
      var curriculum_mapping_id = assessment_items[j].curriculum_mapping;
      var curriculum_mapping = CurriculumMappings.find_document(curriculum_mapping_id);
      // console.log("curriculum_mapping = ", curriculum_mapping);
      var performance_indicator_id = curriculum_mapping.performance_indicator;
      var performance_indicator = PerformanceIndicators.find_document(performance_indicator_id);
      // console.log("performance_indicator = ", performance_indicator);
      if (performance_indicator.student_outcome == student_outcome._id) {
        count += 1;
      }
    }
  }
  return count;
}












