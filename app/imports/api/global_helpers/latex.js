import { _ } from 'meteor/underscore';

var makefile_template =
  "default: MAKE_TARGET.pdf\n\n" +
  "MAKE_TARGET.pdf: DEPENDENCIES\n" +
  "\tpdflatex MAKE_TARGET.tex\n\n" +
  "clean:\n" +
  "\t/bin/rm -f MAKE_TARGET.pdf\n" +
  "\t/bin/rm -f MAKE_TARGET.log\n" +
  "\t/bin/rm -f MAKE_TARGET.aux\n\n";

export function generate_latex_makefile(make_target, dependencies) {

  var makefile = makefile_template;
  makefile = makefile.replace(/MAKE_TARGET/g, make_target);
  var dependencies_string = "";
  _.each(dependencies, function(e) { dependencies_string += e+" ";});
  makefile = makefile.replace(/DEPENDENCIES/g, dependencies_string);

  return makefile;

}