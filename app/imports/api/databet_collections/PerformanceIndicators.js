
PerformanceIndicators = new Mongo.Collection("PerformanceIndicators");

PerformanceIndicators.attachSchema(new SimpleSchema({
  description: {
    type: String,
    optional: false,
  },
  order: {
    type: Number,
    optional: false
  },
  student_outcome: {
    type: String,
    optional: false
  }
}));





