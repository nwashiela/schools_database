const express = require("express");
const bodyParser = require('body-parser');

const App = express();

const exphbs = require("express-handlebars");
const pool = require("./connect");

const session = require('express-session');
const {flash}  = require('express-flash-message');


// Then these two lines after you initialise your express app
App.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
App.set("view engine", "handlebars");

// express-session
App.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
      },
    })
  );

  // apply express-flash-message middleware
// App.use(flash());

// parse application/x-www-form-urlencoded
App.use(bodyParser.urlencoded({ extended: false }))

// parse Application/json
App.use(bodyParser.json())

// apply express-flash-message middleware
App.use(flash({ sessionKeyName: 'flashMessage' }));


// Get teachers
App.get('/teachers', async(req,res)=> {
    try {
        const getTeachers = await pool.query("SELECT * FROM teacher");
        // res.json(getTeachers.rows);
        console.log(getTeachers.rows)
        
        res.render('addTeachers', {
            teachers: getTeachers.rows,
            // messages
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
App.post('/add_teacher', async (req,res)=> {
    try {
        const { first_name, last_name, email} = req.body;
        
        const newTeacher = await pool.query("INSERT INTO teacher (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING * ", [first_name, last_name, email]);
        console.log(newTeacher.rows)
        const getTeachers = await pool.query("SELECT * FROM teacher");
        // res.json(newTeacher.rows[0])
        
        await req.flash('info',`${first_name} is added to the list`)

        // console.log(messages)
        const messages = await req.consumeFlash('info');

        res.render('addTeachers', {
            teachers: getTeachers.rows,
            messages
        })
    } catch (err) {
        console.error(err.message)
    }
})

// Add a new subject
App.post('/add_subject', async(req,res)=> {
    try {
    //    await subjectTeacher(sub)
       
        const { name } = req.body;
        console.log(name)
        const newSubject = await pool.query("INSERT INTO subject (name) VALUES ($1) RETURNING * ", [name]);
        console.log(newSubject)
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
// App.get('/multi_subject', async(req,res)=> {
//     try {

//         const getTeachers = await pool.query("SELECT * FROM teacher");
//         const getSubject = await pool.query("SELECT * FROM subject ");

//         const subjectCount = await pool.query(`select * from find_teachers_teaching_multiple_subjects ()` )

//         const subjectsForTeacher = await pool.query("select subject.* from subject join teacher_subject on subject.id = teacher_subject.subject_id join teacher on teacher_subject.teacher_id = teacher.id where teacher.id = $1", [4])
// console.log(subjectsForTeacher)

//         res.render('asignTeacherAndSubj', {
//             teachers:subjectCount.rows,
//             subject: getSubject.rows,
//             teacher:getTeachers.rows,
//             subsTeacher: subjectsForTeacher.rows
//         })
//        
//     } catch (err) {
//         console.error(err.message)
//     }
// })

App.get('/flash', async function (req, res) {
    // Set a flash message by passing the key, followed by the value, to req.flash().
    await req.flash(
        'info', 'teacher assigned to subject',
        'Massages', ''
        );
    res.redirect('/multi_subject');
  });

App.get('/multi_subject', async (req,res) => {
    const messages = await req.consumeFlash('info');

    let subjects = await pool.query("select * from subject")
    subjects=subjects.rows
    
    let teachers = await pool.query("SELECT * FROM teacher ");
     teachers= teachers.rows
    for (i=0;i<teachers.length;i++) {
        const teacher = teachers[i];
  console.log(teacher)

        const subjectForTeachers = await pool.query("select subject.* from subject join teacher_subject on subject.id = teacher_subject.subject_id join teacher on teacher_subject.teacher_id = teacher.id where teacher.id = $1", [teacher.id])
        teacher.subjects = subjectForTeachers.rows;

        teacher.count = subjectForTeachers.rowCount
      
    }
    
   res.render('asignTeacherAndSubj',{
    teachers,
    subjects,
    messages
    
   })
   
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

