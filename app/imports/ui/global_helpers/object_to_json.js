
export var object_to_json_html = function (obj) {

  if (!obj) {
    return "";
  }
  var html_string = "[ ";
  for (var p in obj) {
    var value ="";
    if (typeof(obj[p]) == 'object') {
      value =  object_to_json_html(obj[p]);
    } else {
      value = obj[p];
    }
    html_string += "<b>"+p+"</b>"+":"+value +", ";
  }
  html_string += " ]";
  return html_string;
};