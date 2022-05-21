const pool=require('../dbconnect')
const date = require('date-and-time')
function stuonlinecls(){

}

stuonlinecls.prototype = {
    onlinecls : async function(studata, resp, callback){
        var currentTime = new Date()
        onlineclsParams=[];
        onlineclsParams.push(studata.userId.userData.deptRef)
        onlineclsParams.push(studata.userId.userData.cls)
        onlineclsParams.push(studata.userId.userData.sec)
        onlineclsParams.push(studata.userId.userData.med)
        onlineclsParams.push(studata.userId.userData.compId)
        onlineclsParams.push(studata.userId.userData.club)
       
        var curDate=date.format(currentTime,'YYYY/MM/DD');
        let sql = await `SELECT o.sno,o.subj,o.stRef,stTime,endTime,o.path,s.subj as subjectName from Onlinecls o,Subjects s where o.subj=s.sno and `+curDate+`<endTime and (o.deptRef=? or o.deptRef=0) and o.cls=? and (o.sec=? or o.sec=0) and (o.med=? or o.med=0)  and o.compId=? and o.subSec=? and o.status='active' order by stTime desc`;
        pool.query(sql,onlineclsParams,function(err,stuOlClsData){

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
               "stuOlClsData":stuOlClsData
              })
         }
        })
    }

}

module.exports = stuonlinecls;