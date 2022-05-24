const pool=require('../dbconnect')
function stuhomework(){
}


stuhomework.prototype = {
    getStuHmw : async function(userData, resp, callback){
        homeworkParams=[];
        homeworkParams.push(userData.userId.userData.compId)
        homeworkParams.push(userData.userId.userData.acadYear)
        homeworkParams.push(userData.userId.userData.cls)
        homeworkParams.push(userData.userId.userData.sec)
        let sql = await `SELECT hwRef,branchId,subjRef,s.subj,homeWork,assignDate,submisnDate as submissionDate from StuHomeWork hw,Subjects s where hw.subjRef=s.sno and branchId=? and hw.acadYear=? and hw.cls=? and hw.sec=? and hw.status='assigned' order by assignDate desc`;
        pool.query(sql,homeworkParams,function(err,homeworkData){

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
               "homeworkData":homeworkData
              })
         }
        })
    }

}

module.exports = stuhomework;