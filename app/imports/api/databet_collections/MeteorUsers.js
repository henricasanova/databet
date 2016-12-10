import { Meteor } from 'meteor/meteor';
import { DatabetCollection} from './DatabetCollection';

class MeteorUsersCollection extends DatabetCollection {

  export_to_JSON() {
    return "[ ]"; // does nothing
  }

  check_JSON_against_schema(doclist) {
    // do nothing
  }

  import_from_JSON(doclist, update_existing) {
   // do nothing
  }

  simpleSchema() {
    return null;
  }

  find_document(doc_id) {
    return Meteor.users.find({_id: doc_id});
  }
}

export var MeteorUsers = new MeteorUsersCollection("MeteorUsers");



