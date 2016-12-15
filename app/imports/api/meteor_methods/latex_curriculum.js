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
  zipfile.file(archive_name + "/curriculum.tex", generate_latex_curriculum(curriculum_id));
  console.log("Generating front_page.tex");
  zipfile.file(archive_name + "/front_page.tex", generate_latex_front_page(curriculum_id));
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
    ["curriculum.tex", "front_page.tex", "courses.tex", "sos.tex", "sos_and_pis.tex", "curriculum_map.tex"]));

}

function generate_README(curriculum_id) {
  return "This is a DataBET-generated version of \"" +
    Curricula.findOne({_id: curriculum_id}).description + "\"" +
    "\n\n";
}

function generate_latex_curriculum() {
  var latex_source = "";
  latex_source += "\\documentclass{article}\n\n";
  latex_source += "\\usepackage{bbding}\n";
  latex_source += "\\usepackage[table]{xcolor}\n";
  latex_source += "\\setlength{\\textwidth}{6.5in}\n";
  latex_source += "\\setlength{\\oddsidemargin}{0in}\n\n";
  latex_source += "\\begin{document}\n\n";
  latex_source += "\\input{front_page}\n";
  latex_source += "\\newpage\n";
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

function generate_latex_front_page(curriculum_id) {
  var latex_source ="";
  latex_source += "\\begin{center}\n";
  latex_source += "\\Large{\\textsc{ " + Curricula.findOne({_id: curriculum_id}).description + "}}\n";
  latex_source += "\\end{center}\n";
  latex_source += "\\begin{center}\n";
  latex_source += "\\Large{\\textsc{Information Sheets}}\n";
  latex_source += "\\end{center}\n\n";
  latex_source += "~\\newline\n";
  latex_source += "\\begin{itemize}\n\n";

  latex_source += "\\item {\\bf Am I teaching a course that should be assessed for ABET?}\n ";
  latex_source += "\\item[] See the list of ABET-relevant courses on page~\\pageref{sec:courses}.\n\n";
  latex_source += "\\item[]\n\n";

  latex_source += "\\item {\\bf What are the ABET \\emph{student outcomes} (SOs) for our B.S. degree?}\n";
  latex_source += "\\item[] See the list of SOs on page~\\pageref{sec:sos}.\n\n";
  latex_source += "\\item[]\n\n";

  latex_source += "\\item {\\bf What are the \\emph{performance indicators}  (PIs), ";
  latex_source += " i.e., specific things that can ";
  latex_source += "be measured, for the SOs?}\n";
  latex_source += "\\item [] See the list of PIs for each SO ";
  latex_source += " on page~\\pageref{sec:sos_and_pis}.\n\n";
  latex_source += "\\item[]\n\n";


  latex_source += "\\item {\\bf Which SOs should I list on my course's syllabus? }\n";
  latex_source += "\\item []See the summary curriculum map ";
  latex_source += " on page~\\pageref{sec:curriculum_map}.\n\n";

  latex_source += "\\end{itemize}\n";

  return latex_source;
}

function generate_latex_courses(curriculum_id) {
  var latex_source = "";

  latex_source += " \\begin{center}\\textsc{List of courses}\\end{center}\n";
  latex_source += "\\label{sec:courses}\n";
  latex_source += "\\begin{itemize}\n";

  var courses = Courses.find({"curriculum": curriculum_id}, {sort: {alphanumeric: 1}}).fetch();
  for (var i=0; i < courses.length; i++) {
    var course = courses[i];
    latex_source += "\\item {\\bf "+ course.alphanumeric + ": } ";
    latex_source += course.title + "\n";
  }
  latex_source += "\\end{itemize}\n";

  return latex_source;
}

function generate_latex_sos(curriculum_id) {
  var latex_source = "";

  latex_source += " \\begin{center}\\textsc{List of SOs}\\end{center}\n";
  latex_source += "\\label{sec:sos}\n";
  latex_source += "\\begin{itemize}\n";

  var sos = StudentOutcomes.find({"curriculum": curriculum_id}, {sort: {order: 1}}).fetch();
  for (var i=0; i < sos.length; i++) {
    var so = sos[i];
    latex_source += "\\item {\\bf SO\\#"+ (i+1) + ": } ";
    latex_source += so.description + "\n";
  }
  latex_source += "\\end{itemize}\n";

  return latex_source;
}

function generate_latex_sos_and_pis(curriculum_id) {
  var latex_source = "";

  latex_source += " \\begin{center}\\textsc{List of SOs with associated PIs}\\end{center}\n";
  latex_source += "\\label{sec:sos_and_pis}\n";
  latex_source += "\\begin{itemize}\n";

  var sos = StudentOutcomes.find({"curriculum": curriculum_id}, {sort: {order: 1}}).fetch();
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

function generate_latex_curriculum_map(curriculum_id) {
  var sos = StudentOutcomes.find({"curriculum": curriculum_id}, {sort: {order: 1}}).fetch();
  var courses = Courses.find({curriculum: curriculum_id}).fetch();

  var latex_source = "";

  latex_source += "\\begin{center}\\textsc{Curriculum Map}\\end{center}\n";
  latex_source += "\\label{sec:curriculum_map}\n";


  latex_source += "\\begin{center}";
  latex_source += "\\setlength{\\tabcolsep}{10pt} % Default value: 6pt\n";
  latex_source += "\\renewcommand{\\arraystretch}{1.5} % Default value: 1\n";
  latex_source += "\\begin{tabular}{l|";
  for (var i=0; i < sos.length; i++) {
    latex_source += "c|";
  }
  latex_source += "}\n";

  latex_source += "\\multicolumn{1}{l|}{ } &";
  for (var i=0; i < sos.length; i++) {
    latex_source += "\\cellcolor{blue!15}{\\bf SO\\#"+(i+1)+"} &";
  }
  latex_source = latex_source.slice(0, -1);
  latex_source += "\\\\\n";
  latex_source += "\\hline\n";

  for (var i=0; i < courses.length; i++) {
    var course = courses[i];
    latex_source += "\\cellcolor{blue!15}{\\bf "+course.alphanumeric + "} &";
    for (var j=0; j < sos.length; j++) {
      var count = 0;
      var pis = PerformanceIndicators.find({student_outcome: sos[j]._id}).fetch();
      console.log("PIs = ", pis);
      for (var k=0; k < pis.length; k++) {
        count += CurriculumMappings.find({course: course._id, performance_indicator: pis[k]._id}).count();
      }
      if (count == 0) {
        latex_source += " - &";
      } else {
        latex_source += "{\\bf \\CheckmarkBold} &";
      }
    }
    latex_source = latex_source.slice(0, -1);
    latex_source += "\\\\\n";
    latex_source += "\\hline\n";
  }

  latex_source += "\\end{tabular}\n";
  latex_source += "\\end{center}";

  latex_source += "~\\newline\n";
  latex_source += "~\\newline\n";
  latex_source += "\\begin{itemize}\n";

  var sos = StudentOutcomes.find({"curriculum": curriculum_id}, {sort: {order: 1}}).fetch();
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