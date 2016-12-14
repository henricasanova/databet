/**
 * Created by casanova on 12/9/16.
 */

import { get_global, set_global } from './set_get_globals.js';
import { Semesters } from '../databet_collections/Semesters';

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
  return semesterdoc_to_semesterstring(semester);
};

export var semesterdoc_to_semesterstring = function (semester) {
  if (semester) {
    return semester.session + " " + semester.year;
  }
  return "unknownsemester";
};