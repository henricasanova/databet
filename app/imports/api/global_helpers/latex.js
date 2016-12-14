
var makefile_template =
  "default: MAKE_TARGET.pdf\n\n" +
  "MAKE_TARGET.pdf: MAKE_TARGET.tex\n" +
  "\tpdflatex MAKE_TARGET.tex\n\n" +
  "clean:\n" +
  "\t/bin/rm -f MAKE_TARGET.log\n" +
  "\t/bin/rm -f MAKE_TARGET.aux\n\n";

export function generate_latex_makefile(make_target) {
  return makefile_template.replace(/MAKE_TARGET/g, make_target);
}