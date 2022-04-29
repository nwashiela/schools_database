const express = require("express");
const bodyParser = require('body-parser');

const App = express();

const exphbs = require("express-handlebars");
const pool = require("./connect");


// Then these two lines after you initialise your express app
App.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
App.set("view engine", "handlebars");


// parse application/x-www-form-urlencoded
App.use(bodyParser.urlencoded({ extended: false }))

// parse Application/json
App.use(bodyParser.json())

// Get teachers
App.get('/teachers', async(req,res)=> {
    try {
        const getTeachers = await pool.query("SELECT * FROM teacher");
        // res.json(getTeachers.rows);
        console.log(getTeachers.rows)
        res.render('addTeachers', {
            teachers: getTeachers.rows
        })
    } catch (err) {
        console.error(err.message)
    }
})


// Get subjects
App.get('/subject', async(req,res)=> {
    try {

        const getSubject = await pool.query("SELECT * FROM subject ");
        console.log(getSubject.rows)
      res.render('addSubjects', {
          subject: getSubject.rows
      })
    } catch (err) {
        console.error(err.message)
    }
})

// Get teacher_subject table
App.get('/teacher_subject', async(req,res)=> {
    try {
        const getteacherSubject = await pool.query("SELECT * FROM teacher_subject ");
        res.json(getteacherSubject.rows);
        console.table(getteacherSubject.rows)
    } catch (err) {
        console.error(err.message)
    }
})

// Add a new teacher
App.post('/add_teacher', async(req,res)=> {
    try {
        const { first_name, last_name, email} = req.body;
        
        const newTeacher = await pool.query("INSERT INTO teacher (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING * ", [first_name, last_name, email]);
        console.log(newTeacher.rows)
        const getTeachers = await pool.query("SELECT * FROM teacher");
        // res.json(newTeacher.rows[0])
        res.render('addTeachers', {
            teachers: getTeachers.rows,
        })
    } catch (err) {
        console.error(err.message)
    }
})

// Add a new subject
App.post('/add_subject', async(req,res)=> {
    try {
        const { name } = req.body;
        console.log(name)
        const newSubject = await pool.query("INSERT INTO subject (name) VALUES ($1) RETURNING * ", [name]);
        
        // res.json(newSubject.rows[0])
        const getSubject = await pool.query("SELECT * FROM subject ");
        res.render('addSubjects', {
            subject: getSubject.rows
        })
    } catch (err) {
        console.error(err.message)
    }
})

// Delete a teacher by id
App.get('/del_teacher/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const delTeacher = await pool.query("DELETE FROM teacher WHERE id = $1", [id])
        console.log(delTeacher.rows)
        const getTeachers = await pool.query("SELECT * FROM teacher");

        // res.json("teacher deleted")
        res.render('addTeachers', {
            teachers: getTeachers.rows
        })
    } catch (err) {
        console.error(err.message)
    }
})

// Delete a subject by id
App.get('/del_subject/:id', async(req, res) => {
    try {
        
        const { id } = req.params;

        const getSubject = await pool.query("SELECT * FROM subject ");
        const delSubject = await pool.query("DELETE FROM subject WHERE id = $1", [id])
        
        res.render('addSubjects', {
            subject: getSubject.rows
        })
    } catch (err) {
        console.error(err.message)
    }
})

// Get teachers with multiple susbjects
App.get('/multi_subject', async(req,res)=> {
    try {
        const getTeachers = await pool.query("SELECT * FROM teacher");
        const getSubject = await pool.query("SELECT * FROM subject ");
        // const subjectCount = await pool.query("select teacher.first_name, teacher.last_name, count(*) from teacher join teacher_subject on teacher.id = teacher_subject.teacher_id join subject on teacher_subject.subject_id = subject.id group by  teacher.first_name, teacher.last_name having count(subject.name) > 1");
        const subjectCount = await pool.query(`select * from find_teachers_teaching_multiple_subjects ()` )
console.log(subjectCount.rows)
        res.render('systemDatabase', {
            teachers:subjectCount.rows,
            subject: getSubject.rows,
            teacher:getTeachers.rows
        })
        // console.table(subjectCount.ro
    } catch (err) {
        console.error(err.message)
    }
})
App.post('/assign', async(req,res)=> {
    try {
        const getTeachers = await pool.query("SELECT * FROM teacher");
        const getSubject = await pool.query("SELECT * FROM subject ");
         await pool.query(`select * from link_teacher_to_subject (${req.body.teacher_name}, ${req.body.subject_name})`);
        // res.json(getTeachers.rows);
        console.log(getTeachers.rows)
        res.redirect('/multi_subject')
    } catch (err) {
        console.error(err.message)
    }
})

App.listen(3000, () => {
    console.log("server started on port 3000")
})