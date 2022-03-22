const sql = require("../config/vacCenterDB")

//constructor
const VacCenter = function(vacCenter){
    this.id = vacCenter.id;
    this.name = vacCenter.name;
    this.tel = vacCenter.tel;
}

VacCenter.getAll = result => {
    sql.query("SELECT * FROM vacCenters",(err,res)=>{
        if(err){
            console.log("error: ",err);
            result(null,err);
            return;
        }

        console.log("vacCenters: ",res);
        for(var i = 0 ; i < res.length;i++){
            res[i].id =  res[i].id.toString()
        }
        result(null,res)
    })
}

module.exports = VacCenter;