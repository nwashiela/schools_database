const express = require("express");
const bodyParser = require('body-parser')
const App = express();
const pool = require("./connect");
const exphbs = require("express-handlebars");

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
        res.json(getTeachers.rows);
        console.table(getTeachers.rows)
    } catch (err) {
        console.error(err.message)
    }
})

App.get('/getAll', async(req,res)=> {
    try {
        const getAndCount = await pool.query("SELECT ");
        res.json(getAndCount.rows);
        console.table(getAndCount.rows)
    } catch (err) {
        console.error(err.message)
    }
})

// Get subjects
App.get('/subject', async(req,res)=> {
    try {
        const getSubject = await pool.query("SELECT * FROM subject ");
        res.json(getSubject.rows);
        console.table(getSubject.rows)
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
        res.json(newTeacher.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

// Delete a teacher by id
App.delete('/del_teacher/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const delTeacher = await pool.query("DELETE FROM teacher WHERE id = $1", [id])
        res.json("teacher deleted")
    } catch (err) {
        console.error(err.message)
    }
})

// Delete a subject by id
App.delete('/del_subject/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const delSubject = await pool.query("DELETE FROM subject WHERE id = $1", [id])
        res.json("subject removed")
    } catch (err) {
        console.error(err.message)
    }
})

// Add a new subject
App.post('/add_subject', async(req,res)=> {
    try {
        const { name } = req.body;
        const newSubject = await pool.query("INSERT INTO subject (name) VALUES ($1) RETURNING * ", [name]);
        res.json(newSubject.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

// Get teachers with multiple susbjects
App.get('/multi_subject', async(req,res)=> {
    try {
        const subjectCount = await pool.query("select teacher.first_name, teacher.last_name, teacher.email, count(*) from teacher join teacher_subject on teacher.id = teacher_subject.teacher_id join subject on teacher_subject.subject_id = subject.id group by teacher.id, teacher.first_name, teacher.last_name, teacher.email having count(subject.name) > 1");
        res.json(subjectCount.rows);
        console.table(subjectCount.rows)
    } catch (err) {
        console.error(err.message)
    }
})


App.listen(3000, () => {
    console.log("server started on port 3000")
})