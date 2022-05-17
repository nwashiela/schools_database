const parse = require("nodemon/lib/cli/parse")

moduke.export = Factory => (pool) {
    let multi_tach = (par)=>{
        
       par = await (pool.query(` find_teachers_teaching_multiple_subjects ()`)).rows;


    }
}