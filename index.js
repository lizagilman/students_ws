var http = require('http');
var students_grades = require('./StudentsGrades.json');
var express = require('express');
var app = express();
// var routes = require('./routes/index');



app.get('/',function(req, res){
    res.sendfile('./students-api.html');
});


// get all students
app.get('/students',function(req, res){
  res.status(200).json(students_grades);
});


// get student's grades by id
app.get('/grades-by-student-id/:id',function(req,res){
    var message;
    var id = parseInt(req.params.id,10);
    var status = 200;
    if(!id){
        status = 400;
        if (id == 0){
            message = {"message":"id = 0 is invalid"};
        }
        else{
            message = {"message":"Invalid id. Student id must be an integer"};
        }
      }
    else{
        for(var i = 0 ; i < students_grades.students.length; i++){
          if(students_grades.students[i].id == id){
              var student = students_grades.students[i];
              var json_courses = student.courses;
              message = [];
              for (var j=0;j< json_courses.length; j++){
                  var grade =  student.courses[j].grade;
                  message.push(grade);
              }
              break;
          }
            else{
              message = {"message": id + "not fount"};
          }
        }
      }
      res.status(status).send(message);
});


// get top 3 grades of given year
app.get('/excellence-by-year/:year', function(req, res){
  var status = 200;
    var year = parseInt(req.params.year,10);
    var message;
    //console.log(year);
  if(year > 2015 || year < 2000 || !year){
      status = 400;
     message = {"message": "Invalid year parameter"};
  }
  else{
      var best_students = best_students_by_year(year)
      if (best_students ==1){
         message = {"message": "No data for this year. For example use 2013"};
      }
      else {
          message = best_students;
      }
  }
  res.status(status).send(message);
});


app.get('*', function(req, res){
  var message =  {"message":"undefined request"};
  res.send(message, 400);
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Listening to port %d, %s mode", this.address().port, app.settings.env);
});


function best_students_by_year(input_year){
    var grades = [];
    var students = students_grades.students;
    for(var i = 0; i < students.length; i++){
        var courses = students_grades.students[i].courses;
        var grades_sum = 0;
        for(var j=0; j<courses.length; j++){
            var course = courses[j];
            if(course.year == input_year){
                grades_sum += course.grade;
            }
        }
        grades.push(grades_sum/courses.length);
    }
    if(grades[0]){
        bubbleSort(grades);
        var top_3_students = [grades[0], grades[1], grades[2]];
        return top_3_students;
    }
    else{
        //return {"message": "No data for this year. For example use 2013"};
        return 1;
    }
}


function bubbleSort(array){
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < array.length-1; i++) {
            if (array[i] < array[i+1]) {
                var temp = array[i];
                array[i] = array[i+1];
                array[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}




