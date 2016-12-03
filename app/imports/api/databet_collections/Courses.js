
Courses = new Mongo.Collection("Courses");

Courses.attachSchema(new SimpleSchema({
  alphanumeric: {
    type: String,
    optional: false,
  },
  title: {
    type: String,
    optional: false,
  },
  curriculum: {
    type: String,
    optional: false
  }
}));





