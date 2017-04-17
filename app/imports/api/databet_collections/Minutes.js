import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DatabetCollection} from './DatabetCollection';
import { OfferedCourses } from './OfferedCourses';
import { CurriculumMappings} from './CurriculumMappings';

class MinutesCollection extends DatabetCollection {

}


export const Minutes = new MinutesCollection("Minutes");

Minutes.attachSchema(new SimpleSchema({
  _id: {
    type: String,
    optional: false
  },
  type: {
    type: String,
    optional: false,
  },
  date: {
    type: Date,
    optional: false,
  },
  participants: {
    type: String,
    optional: false
  },
  minutes: {
    type: String,
    optional: false
  }
}));





