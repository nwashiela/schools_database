module.exports = function getAllFunctions(schoolDT){

    async function getteachers(req,res){
        res.render("index", {
            list: await schoolDT.add_teachers(),
        })
    }
    return{
        getteachers
    }
}