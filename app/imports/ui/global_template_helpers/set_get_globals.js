import {set_global, get_global} from '../global_helpers/set_get_globals';

Template.registerHelper('set_global', function (name, value) {
  set_global(name, value);
});

Template.registerHelper('get_global', function (name) {
  return get_global(name);
});


