/* Wrappers around the get/set global helpers */

import { get_global, set_global } from '../../ui/global_helpers/set_get_globals';
import { Semesters } from '../../api/databet_collections/Semesters';

export var get_current_semester = function () {
  return get_global("currentSemesterId");
};

export var get_current_semester_string = function () {
  var semester_id = get_global("currentsemester_id");
  if (semester_id) {
    return semesterid_to_semesterstring(semester_id);
  } else {
    return "-- select a semester --";
  }
};

export var set_current_semester = function (id) {
  set_global("currentSemesterId", id);
};


export var semesterid_to_semesterstring = function (id) {
  var semester = Semesters.findOne({_id: id});

  if (semester) {
    return semester.session + " " + semester.year;
  }
  return "unknownsemester";
};

export var semesterstring_to_semesterid = function (string) {

  var tokens = string.split(" ");
  var session = tokens[0];
  var year = Number(tokens[1]);

  var semester = Semesters.findOne({"session": session, "year": year});
  if (semester)
    return semester._id;
  else
    return null;
};


// Global helpers

Template.registerHelper('get_current_semester', function () {
  return get_current_semester();
});

Template.registerHelper('set_current_semester', function (id) {
  return set_current_semester(id);
});

Template.registerHelper('get_current_semester_string', function () {
  return get_current_semester_string();
});
