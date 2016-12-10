/**
 * Created by casanova on 12/9/16.
 */

import { Template } from 'meteor/templating';

export var trim_date = function (date) {
  return (1 + date.getMonth()) + "/" + date.getDate() + "/" + date.getFullYear();
};
