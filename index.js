const express = 'express';
const bodyParser = "body-parser";
const exphbs = "express-handlebars";
const pg = require("pg");
const Pool = pg.Pool;
const sch = require("./functions");
const Routes = require("./routes");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://nwashiela:pgnwmahela12@gmail.com@localhost:3000/schools";

const pool = new Pool({
  connectionString,
});

//setup template handlebars as the template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// app.use(cors());

const sch = Reg(pool);
const catchscl = Routes(schoolDT);

app.use(express.static("public"));

app.get("/", catchscl.getteachers());

app.post("/teachers", catchscl);

app.get("/teachers", catchscl);

app.get("/clearAll",catchscl);

app.listen(port, () =>
console.log(`Server is listerning on port: http://localhost:${port} `) 
);

// app.get("/",async (req,res)=>{
//     await pool.query("select * from add_teachers("teacher_name")")
//     res.render('index',{});
//     })