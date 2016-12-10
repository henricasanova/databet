/* Wrappers around the get/set global helpers */

import {get_current_semester, set_current_semester,get_current_semester_string} from '../global_helpers/semester';


Template.registerHelper('get_current_semester', function () {
  return get_current_semester();
});

Template.registerHelper('set_current_semester', function (id) {
  return set_current_semester(id);
});

Template.registerHelper('get_current_semester_string', function () {
  return get_current_semester_string();
});
