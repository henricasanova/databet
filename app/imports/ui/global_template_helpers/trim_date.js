import { trim_date } from '../global_helpers/trim_date.js';

Template.registerHelper('trim_date', function (date) {
  return trim_date(date);
});

