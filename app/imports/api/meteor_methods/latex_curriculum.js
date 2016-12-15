import '../../api/databet_collections';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { save_and_publish_zipfile } from '../global_helpers/downloadable_zipfile';
import { generate_latex_makefile } from '../global_helpers/latex';
import { Curricula } from '../../api/databet_collections/Curricula';
import { Courses } from '../../api/databet_collections/Courses';
import { StudentOutcomes } from '../../api/databet_collections/StudentOutcomes';
import { PerformanceIndicators } from '../../api/databet_collections/PerformanceIndicators';
import { CurriculumMappings } from '../../api/databet_collections/CurriculumMappings';

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

  console.log("Generating curriculum.tex");
  zipfile.file(archive_name + "/curriculum.tex", generate_latex_curriculum());
  console.log("Generating courses.tex");
  zipfile.file(archive_name + "/courses.tex", generate_latex_courses(curriculum_id));
  console.log("Generating sos.tex");
  zipfile.file(archive_name + "/sos.tex", generate_latex_sos(curriculum_id));
  console.log("Generating sos_and_pis.tex");
  zipfile.file(archive_name + "/sos_and_pis.tex", generate_latex_sos_and_pis(curriculum_id));
  console.log("Generating curriculum_map.tex");
  zipfile.file(archive_name + "/curriculum_map.tex", generate_latex_curriculum_map(curriculum_id));
  console.log("Generating detailed_curriculum_map.tex");
  zipfile.file(archive_name + "/detailed_curriculum_map.tex", generate_latex_detailed_curriculum_map(curriculum_id));

  console.log("Generating Makefile");
  zipfile.file(archive_name + "/Makefile", generate_latex_makefile("curriculum",
    ["curriculum.tex", "courses.tex", "sos.tex", "sos_and_pis.tex", "curriculum_map.tex"]));

}

function generate_README(curriculum_id) {
  return "This is a DataBET-generated version of \"" +
    Curricula.findOne({_id: curriculum_id}).description + "\"" +
    "\n\n";
}

function generate_latex_curriculum() {
  var latex_source = "";
  latex_source += "\\documentclass{article}\n\n";
  latex_source += "\\usepackage{amssymb}\n";
  latex_source += "\\begin{document}\n";
  latex_source += "\\input{courses}\n";
  latex_source += "\\newpage\n";
  latex_source += "\\input{sos}\n";
  latex_source += "\\newpage\n";
  latex_source += "\\input{sos_and_pis}\n";
  latex_source += "\\newpage\n";
  latex_source += "\\input{curriculum_map}\n";
  latex_source += "\n\\end{document}\n";
  return latex_source;
}

function generate_latex_courses(curriculumId) {
  var latex_source = "";

  latex_source += "\\begin{center}\n \\textsc{ " + Curricula.findOne({_id: curriculumId}).description + "}\n\\end{center}\n\n";
  latex_source += "~\\newline\n";
  latex_source += " {\\bf List of courses:}\\newline\n";
  latex_source += "\\begin{itemize}\n";

  var courses = Courses.find({"curriculum": curriculumId}, {sort: {alphanumeric: 1}}).fetch();
  for (var i=0; i < courses.length; i++) {
    var course = courses[i];
    latex_source += "\\item {\\bf "+ course.alphanumeric + ": } ";
    latex_source += course.title + "\n";
  }
  latex_source += "\\end{itemize}\n";

  return latex_source;
}

function generate_latex_sos(curriculumId) {
  var latex_source = "";

  latex_source += "\\begin{center}\n \\textsc{ " + Curricula.findOne({_id: curriculumId}).description + "}\n\\end{center}\n\n";
  latex_source += "~\\newline\n";
  latex_source += " {\\bf List of SOs:}\\newline\n";
  latex_source += "\\begin{itemize}\n";

  var sos = StudentOutcomes.find({"curriculum": curriculumId}, {sort: {order: 1}}).fetch();
  for (var i=0; i < sos.length; i++) {
    var so = sos[i];
    latex_source += "\\item {\\bf SO\\#"+ (i+1) + ": } ";
    latex_source += so.description + "\n";
  }
  latex_source += "\\end{itemize}\n";

  return latex_source;
}

function generate_latex_sos_and_pis(curriculumId) {
  var latex_source = "";

  latex_source += "\\begin{center}\n \\textsc{ " + Curricula.findOne({_id: curriculumId}).description + "}\n\\end{center}\n\n";
  latex_source += "~\\newline\n";
  latex_source += " {\\bf List of SOs with associated PIs:}\\newline\n";
  latex_source += "\\begin{itemize}\n";

  var sos = StudentOutcomes.find({"curriculum": curriculumId}, {sort: {order: 1}}).fetch();
  for (var i=0; i < sos.length; i++) {
    var so = sos[i];
    latex_source += "\\item {\\bf SO\\#"+ (i+1) + ": } ";
    latex_source += so.description + "\n";
    var pis = PerformanceIndicators.find({student_outcome: so._id}).fetch();
    latex_source += "\t\\begin{itemize}\n";
    for (var j=0; j < pis.length; j++) {
      var pi = pis[j];
      latex_source += "\t\t\\item {\\bf PI\\#"+(j+1)+": } ";
      latex_source += pi.description + "\n";
    }
    latex_source += "\t\\end{itemize}\n";

  }
  latex_source += "\\end{itemize}\n";

  return latex_source;
}

function generate_latex_curriculum_map(curriculumId) {
  var sos = StudentOutcomes.find({"curriculum": curriculumId}, {sort: {order: 1}}).fetch();
  var courses = Courses.find({curriculum: curriculumId}).fetch();

  var latex_source = "";

  latex_source += "\\begin{center}\n \\textsc{ " + Curricula.findOne({_id: curriculumId}).description + "}\n\\end{center}\n\n";
  latex_source += "~\\newline\n";
  latex_source += " {\\bf Curriculum Map:}\\newline\\newline\n";

  latex_source += "\\begin{tabular}{|l|";
  latex_source += Array(1 + sos.length).join("c|");
  latex_source += "}\n";
  latex_source += "\\hline\n";

  latex_source += " &";
  for (var i=0; i < sos.length; i++) {
    latex_source += "{\\bf SO\\#"+(i+1)+"} &";
  }
  latex_source = latex_source.slice(0, -1);
  latex_source += "\\\\\n";
  latex_source += "\\hline\n";

  for (var i=0; i < courses.length; i++) {
    var course = courses[i];
    latex_source += "{\\bf "+course.alphanumeric + "} &";
    for (var j=0; j < sos.length; j++) {
      var count = 0;
      var pis = PerformanceIndicators.find({student_outcome: sos[j]._id}).fetch();
      console.log("PIs = ", pis);
      for (var k=0; k < pis.length; k++) {
        count += CurriculumMappings.find({course: course._id, performance_indicator: pis[k]._id}).count();
      }
      if (count == 0) {
        latex_source += " n/a &";
      } else {
        latex_source += "{\\bf \\checkmark} &";
      }
    }
    latex_source = latex_source.slice(0, -1);
    latex_source += "\\\\\n";
    latex_source += "\\hline\n";
  }

  latex_source += "\\end{tabular}\n";

  latex_source += "\\newline\\newline";
  latex_source += "\\begin{itemize}\n";

  var sos = StudentOutcomes.find({"curriculum": curriculumId}, {sort: {order: 1}}).fetch();
  for (var i=0; i < sos.length; i++) {
    var so = sos[i];
    latex_source += "\\item {\\bf SO\\#"+ (i+1) + ": } ";
    latex_source += so.description + "\n";
  }
  latex_source += "\\end{itemize}\n";

  return latex_source;

}

function generate_latex_detailed_curriculum_map(curriculum_id) {

}