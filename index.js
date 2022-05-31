const express = require("express");
const bodyParser = require('body-parser');

const App = express();

const exphbs = require("express-handlebars");
const pool = require("./connect");

const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const flash  = require('express-flash');


App.use(express.static('public'))
// Then these two lines after you initialise your express app
App.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
App.set("view engine", "handlebars");

// initialise session middleware - flash-express depends on it
// App.use(session({
//     secret : "secret",
//     resave: false,
//     saveUninitialized: true
//   }));
App.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat',
    saveUninitialized: true
}))

  // initialise the flash middleware
App.use(flash());


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
        
     req.flash('info',`${first_name} is added to the list`)

        // console.log(messages)
        res.render('addTeachers', {
            teachers: getTeachers.rows,
            
        })
    } catch (err) {
        if(err.code == "23505"){
            req.flash('info', 'already added' )
            res.redirect('/teachers')
        }
        console.log(err.code)
    }
})

// Add a new subject
App.post('/add_subject', async(req,res)=> {
    try {
    //    await subjectTeacher(sub)
        const { name } = req.body;
        console.log(name)

        // avoid dublicates
        

        const newSubject = await pool.query("INSERT INTO subject (name) VALUES ($1) RETURNING * ", [name]);
        console.log(newSubject)
        
        // res.json(newSubject.rows[0])
        const getSubject = await pool.query("SELECT * FROM subject ");
        // await req.flash('info',`${name} is added to the list!`)
        // const subjctMessages = await req.consumeFlash('info');
        req.flash('info', `${name} is added to the list!`);

        res.render('addSubjects', {
            subject: getSubject.rows,

        })

    } catch (err) {
        // prevent app from crashing
        
        if(err.code == '23505'){
            req.flash('info', 'already added' )
            res.redirect('/subject')
        }
        //gets the code by its own
        console.log(err.code)
    }
})

// Delete a teacher by id
App.get('/del_teacher/:id', async(req, res) => {
    try {
        const { id } = req.params;

        const teacherName = await pool.query("SELECT first_name FROM teacher WHERE id = $1", [id])

        const delTeacher = await pool.query("DELETE FROM teacher WHERE id = $1", [id])
        console.log(delTeacher.rows)

        const getTeachers = await pool.query("SELECT * FROM teacher");

        // res.json("teacher deleted")
        req.flash('info', `${teacherName.rows[0].first_name} is deleted`);

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

        const subjectName = await pool.query("SELECT name FROM subject WHERE id = $1", [id])

        const delSubject = await pool.query("DELETE FROM subject WHERE id = $1", [id])

        const getSubjects = await pool.query("SELECT * FROM subject ");

        // await req.flash('info',`${id} is deleted`)
        // const deleteSubject = await req.consumeFlash('info');
        req.flash('info', `${subjectName.rows[0].name} is deleted`);
        res.render('addSubjects', {
            subject: getSubjects.rows,

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

App.get('/multi_subject', async (req,res) => {

    let subjects = await pool.query("select * from subject")
    subjects=subjects.rows
    
    let teachers = await pool.query("SELECT * FROM teacher ");
     teachers= teachers.rows

    for (i=0;i<teachers.length;i++) {
        const teacher = teachers[i];
        // console.log(teacher)

        const subjectForTeachers = await pool.query("select subject.* from subject join teacher_subject on subject.id = teacher_subject.subject_id join teacher on teacher_subject.teacher_id = teacher.id where teacher.id = $1", [teacher.id])
        teacher.subjects = subjectForTeachers.rows;

        teacher.count = subjectForTeachers.rowCount
    }

    //    await req.flash('info',`${teacher_name} is assign to ${subject_name}`);

    //      const assign = await req.consumeFlash('info');
   res.render('asignTeacherAndSubj',{
    teachers,
    subjects,
    // assign
    
   })
   
}) 

App.post('/assign', async(req,res)=> {
    try {
      
        const getTeachers = await pool.query("SELECT * FROM teacher where id =$1",[req.body.teacher_name]);
        const getSubject = await pool.query("SELECT * FROM subject where id = $1",[req.body.subject_name]);
        
         await pool.query(`select * from link_teacher_to_subject (${req.body.teacher_name}, ${req.body.subject_name})`);
        // res.json(getTeachers.rows);
        // console.log(getTeachers.rows)
        const teacher_name = getTeachers.rows[0].first_name
        const subject_name = getSubject.rows[0].name

        req.flash('info', `${teacher_name} is assign to ${subject_name}`);
        res.redirect('/multi_subject')
    } catch (err) {
        console.error(err.message)
    }
})

// Get teachers teaching same subject
App.get('/teacher_for_subject/:name', async (req,res) => {
    try {
        const { name } = req.params;
        // console.log(name)

        const getTeachersWithSub = await pool.query("select	teacher.* from teacher join teacher_subject on teacher.id = teacher_subject.teacher_id join subject on teacher_subject.subject_id = subject.id where subject.name = $1", [name]);
        console.log(getTeachersWithSub.rows)
        const getTeachers = await pool.query("SELECT * FROM teacher");

        res.render('teachersTeachingSameSub',{
            getTachersName:getTeachersWithSub.rows
        })
    } catch (err) {
        console.error(err.message)
    }
})

const PORT = process.env.PORT || 3001;

App.listen(PORT, () => {
    console.log("server started on port 3001")
})

