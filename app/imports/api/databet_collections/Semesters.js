
export var Semesters = new Mongo.Collection("Semesters");

Semesters.attachSchema(new SimpleSchema({
  session: {
    type: String,
    optional: false,
  },
  year: {
    type: Number,
    optional: false,
  },
  order: {
    type: Number,
    optional: false,
  },
  curriculum: {
    type: String,
    optional: false
  },
  locked: {
    type: Boolean,
    optional: false
  }
}));





