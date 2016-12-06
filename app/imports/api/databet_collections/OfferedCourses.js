
export var OfferedCourses = new Mongo.Collection("OfferedCourses");

OfferedCourses.attachSchema(new SimpleSchema({
  course: {
    type: String,
    optional: false,
  },
  semester: {
    type: String,
    optional: false,
  },
  instructor: {
    type: String,
    optional: false
  },
  archived: {     // archived by instructor
    type: Boolean,
    optional: false
  }
}));





