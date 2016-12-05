import { Template } from 'meteor/templating';

Template.FAQ.onRendered(function () {
  $('.ui.accordion')
    .accordion()
  ;
});

