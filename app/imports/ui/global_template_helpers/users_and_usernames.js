/* Wrappers around the get/set global helpers */
import { get_current_user, set_current_user, get_current_username } from '../../api/global_helpers/users_and_usernames';

Template.registerHelper('get_current_user', function () {
  return get_current_user();
});

Template.registerHelper('set_current_user', function (id) {
  return set_current_user(id);
});

Template.registerHelper('get_current_username', function () {
  return get_current_username();
});
