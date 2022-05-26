const pool=require('../dbconnect')
function branchevents(){

}

branchevents.prototype = {
    events : async function(studata, resp, callback){

        let sql = await `SELECT dateFrom,dateTo,eventName,eventDescr from Events where compId=? order by dateTo desc`;
        pool.query(sql,studata.userId.userData.compId,function(err,eventData){

            if (err) {
                callback({
                   "code":400,
                  "failed":"error ocurred while executing onlineclaass query"
                 })
               }
             else{
               callback({
                "code":200,
               "success":"Done",
               "stuOlClsData":eventData
              })
         }
        })
    }

}




module.exports = branchevents;