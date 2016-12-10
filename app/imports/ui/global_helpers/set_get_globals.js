/**
 * Created by casanova on 12/9/16.
 */

import { Globals } from '../../api/databet_collections/Globals.js';

export var set_global = function (name, value) {
  if (Globals.find({name: name}).count() == 0) {
    Globals.insert({name: name, value: value});
  } else {
    //console.log("IN SET GLOBAL: ", name, value);
    Globals.update({name: name}, {$set: {value: value}});
  }
};

export var get_global = function (name) {
  var global = Globals.findOne({name: name});
  if (global) {
    return global.value;
  } else {
    return null;  // This is to avoid the lame exception upon reload...
  }
};