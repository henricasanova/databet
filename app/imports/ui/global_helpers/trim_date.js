trim_date = function (date) {
  return (1 + date.getMonth()) + "/" + date.getDate() + "/" + date.getFullYear();
}

Template.registerHelper('trim_date', function (date) {
  return trim_date(date);
});

