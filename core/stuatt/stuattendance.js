const pool=require('../dbconnect')

function stuattdet(){

}

stuattdet.prototype = {
    //attendance method
    stuatt : async function(stuattdata, resp, callback){
        let sql = await `SELECT  * from 202205_Attendance where ref=? and refType='stu'`;
     
        pool.query(sql,stuattdata.userId.userData.sno,function(err,stuAttendance){
             if (err) {
                callback({
                   "code":400,
                  "failed":"error ocurred"
                 })
               }
             else{
               console.log("data :",stuAttendance)
               callback({
                "code":200,
               "success":"Done",
               "stuAttendance":stuAttendance
              })
         }
        })
    }
}

module.exports = stuattdet;