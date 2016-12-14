// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import '../../api/databet_collections';
import { collection_dictionary } from '../../startup/both/collection_dictionary';
import { Meteor } from 'meteor/meteor';
import { AssessmentItems } from '../databet_collections/AssessmentItems';
import { Curricula } from '../databet_collections/Curricula';
import { generic_import_docs_from_JSON } from '../../ui/global_helpers/collection_to_json';
import { Random } from 'meteor/random';


Meteor.methods({

  import_JSON: function (json_string, collections_to_update, update_existing) {
    if (Meteor.isServer) {

      console.log("IN IMPORT JSON");
      // Parse json_string
      var data;
      try {
        data = JSON.parse(json_string);
      } catch (e) {
        throw new Meteor.Error("<b>JSON parse error:</b> <br>" + e);
      }

      var i, j, k;
      var collection_name, collection;

      // Pre-process parse data to deal with the single-entry case
      for (j = 0; j < data.length; j++) {
        if (data[j][1].length === undefined) {
          var tmp = data[j][1];
          data[j][1] = [];
          data[j][1][0] = tmp;
        }
      }

      // Fix possible dates
      for (i = 0; i < collections_to_update.length; i++) {
        for (j = 0; j < data.length; j++) {
          // If not the right collection, skip
          collection_name = data[j][0];
          if (collection_name != collections_to_update[i]) {
            continue;
          }

          for (k = 0; k < data[j][1].length; k++) {
            // fix date
            data[j][1][k] = fix_dates(collection_name, data[j][1][k]);
          }
        }
      }

      // Check that every JSON is ok (we do all this before doing any import)
      console.log("Checking JSON validity...");
      var error_message = "";
      // Go through each collection specification and check validity
      for (i = 0; i < collections_to_update.length; i++) {
        for (j = 0; j < data.length; j++) {
          // If not the right collection, skip
          if (data[j][0] != collections_to_update[i]) {
            continue;
          }

          collection_name = data[j][0];
          collection = collection_dictionary[collection_name];

          if (collection_name != "Meteor.users") { // Do something for Meteor.users??
            try {
              var schema = collection.simpleSchema();
              collection.check_JSON_against_schema(data[j][1], schema);
            } catch (e) {
              error_message += e.toString();
            }
          }
        }
      }

      if (error_message != "") {
        throw new Meteor.Error("<br>"+error_message);
      }

      // Do the import!!
      console.log("Updating collections...");
      for (i = 0; i < collections_to_update.length; i++) {
        for (j = 0; j < data.length; j++) {
          collection_name = data[j][0];
          // If not the right collection, skip
          if (collection_name != collections_to_update[i]) {
            continue;
          }
          console.log("Updating collection ", collection_name);
          collection = collection_dictionary[collection_name];
          try {
            if (collection_name == "Meteor.users") {
              generic_import_docs_from_JSON(Meteor.users, data[j][1], update_existing);
            } else {
              collection.import_from_JSON(data[j][1], update_existing);
            }
          } catch (e) {
            console.log("IN IMPORT FROM JASON GOT EXCEPTION", e.toString());
          }
        }
      }
    }
  },



});


/***** HELPERS *****/

function fix_dates(collection_name, doc) {

  var date_fixing_rules = {};

  date_fixing_rules["AssessmentItems"] = ["date_last_modified"];
  date_fixing_rules["Curricula"] = ["date_created"];
  date_fixing_rules["Meteor.users"] = ["createdAt"];

  for (collection_name in date_fixing_rules) {
    if (date_fixing_rules.hasOwnProperty(collection_name)) {
      _.each(date_fixing_rules[collection_name], function (e) {
        if (e in doc) {
          console.log("FIXING ", doc[e], " into ", Date(doc[e]));
          doc[e] = new Date(doc[e]);
        }
      })
    }
  }

  return doc;
}