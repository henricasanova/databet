Template.AdminUserSelect.helpers({

  listOfUsers: function () {
    return Meteor.users.find({});
  },

  is_current_user: function () {
    var current_user = get_current_user();
    return (this._id == get_current_user());
  }
});

Template.AdminUserSelect.events({
  "change .admin_user_select": function (e, t) {
    // Update the current User
    var userId = e.currentTarget.value;
    set_current_user(userId);
  },
});

