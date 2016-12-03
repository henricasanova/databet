
StudentOutcomes = new Mongo.Collection("StudentOutcomes");

StudentOutcomes.attachSchema(new SimpleSchema({
  description: {
    type: String,
    optional: false,
  },
  order: {
    type: Number,
    optional: false
  },
  curriculum: {
    type: String,
    optional: false
  }
}));





