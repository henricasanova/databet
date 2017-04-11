/**
 * Created by casanova on 12/9/16.
 */

import { get_global, set_global } from './set_get_globals.js';
import { Semesters } from '../databet_collections/Semesters';

export const get_current_semester = function () {
  return get_global("currentSemesterId");
};

export const get_current_semester_string = function () {
  const semester_id = get_global("currentsemester_id");
  if (semester_id) {
    return semesterid_to_semesterstring(semester_id);
  } else {
    return "-- select a semester --";
  }
};

export const set_current_semester = function (id) {
  set_global("currentSemesterId", id);
};


export const semesterid_to_semesterstring = function (id) {
  const semester = Semesters.findOne({_id: id});
  return semesterdoc_to_semesterstring(semester);
};

export const semesterdoc_to_semesterstring = function (semester) {
  if (semester) {
    return semester.session + " " + semester.year;
  }
  return "unknownsemester";
};

export const get_session_for_date = function (date) {
  const month = date.getMonth();
  if ((month >= 0) && (month <= 4)) {
    return "Spring";
  }
  if ((month >= 5) && (month <= 7)) {
    return "Summer";
  }
  if ((month >= 8) && (month <=11)) {
    return "Fall";
  }
};
