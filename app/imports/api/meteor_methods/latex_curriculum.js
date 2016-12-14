import '../../api/databet_collections';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { save_and_publish_zipfile } from '../global_helpers/downloadable_zipfile';
import { generate_latex_makefile } from '../global_helpers/latex';
import { Curricula } from '../../api/databet_collections/Curricula';

Meteor.methods({

  latex_curriculum: function(curriculum_id) {

    var archive_name = "latex_curriculum_" + curriculum_id;
    var zipfile = new ZipZap();

    generate_latex_curriculum_source(zipfile, archive_name, curriculum_id);

    console.log("Archiving LaTeX Directory zipped");
    var id_and_url = save_and_publish_zipfile(zipfile, archive_name);
    return id_and_url;
  }

});

function generate_latex_curriculum_source(zipfile, archive_name, curriculum_id) {

  console.log("Generating README.txt");
  zipfile.file(archive_name + "/README.txt", generate_README(curriculum_id));
  console.log("Generating Makefile");
  zipfile.file(archive_name + "/Makefile", generate_latex_makefile("curriculum"));
  console.log("Generating curriculum.txt");
  zipfile.file(archive_name + "/curriculum.tex", generate_latex_curriculum());

}

function generate_README(curriculum_id) {
  return "This is a DataBET-generated version of \"" +
      Curricula.findOne({_id: curriculum_id}).description + "\"" +
      "\n\n";
}

function generate_latex_curriculum() {
  var latex_source = "";
  latex_source += "\\documentclass{article}\n\n";
  latex_source += "\\begin{document}\n";
  latex_source += "\\input{courses}\n";
  latex_source += "\\input{sos}\n";
  latex_source += "\\input{sos_and_pis}\n";
  latex_source += "\\input{curriculum_map}\n";
  latex_source += "\n\\end{document}\n";
  return latex_source;
}





