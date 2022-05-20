const pool=require('../dbconnect')
function Studentnotices(){
}
Studentnotices.prototype = {
    notices : async function(stuData, resp, callback){
        let sql = await `SELECT type as alertType,sysTime as notifyTime,noticeRef,message as notice from Notices where noticeTo=? and status='pending'`;
        pool.query(sql,stuData.userId.userData.sno,function(err,stuNotices){
           
            if (err) {
                callback({
                   "code":400,
                  "failed":"error ocurred while running Notices query"
                 })
               }
             else if(stuNotices!=null && stuNotices.length>0){
                callback({
                    "code":200,
                   "success":"Notices data fetched",
                   "stuNotices":stuNotices
                  })
             }
             else{
                callback({
                    "code":200,
                   "success":"No data available at this time",
                  })
             }
            })
    }
}
module.exports = Studentnotices;