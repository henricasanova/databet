import { Globals } from '../../api/databet_collections/Globals.js';

export var set_global = function (name, value) {
  if (Globals.find({name: name}).count() == 0) {
    Globals.insert({name: name, value: value});
  } else {
    //console.log("IN SET GLOBAL: ", name, value);
    Globals.update({name: name}, {$set: {value: value}});
  }
};

Template.registerHelper('set_global', function (name, value) {
  //console.log("SETTING GLOBAL ", name, " TO ", value);
  set_global(name, value);
});

export var get_global = function (name) {
  var global = Globals.findOne({name: name});
  if (global) {
    return global.value;
  } else {
    return null;  // This is to avoid the lame exception upon reload...
  }
};

Template.registerHelper('get_global', function (name) {
  return get_global(name);
});


