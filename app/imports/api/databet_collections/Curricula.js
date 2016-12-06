export var Curricula = new Mongo.Collection("Curricula");

Curricula.attachSchema(new SimpleSchema({
  description: {
    type: String,
    optional: false,
  },
  date_created: {
    type: Date,
    optional: false
  },
  locked: {
    type: Boolean,
    optional: false
  }
}));





