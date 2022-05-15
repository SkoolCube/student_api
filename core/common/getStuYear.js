const pool=require('../dbconnect')
function StuYear(){};
StuYear.prototype = {
    getStuAcadYear : async function(userData, resp, callback){
        let yearStr="";
        let stuDyTab="";
        console.log("acadYear::",userData.userId.userData.sno);
        let sql = await `SELECT * FROM Acadyear WHERE sno=?`;
        pool.query(sql,userData.body.acadYear,function(err,acadYearDetails){
            if (err) {
                callback({
                  "code":400,
                  "failed":"error ocurred"
                })
              }
            else{
                if(acadYearDetails[0].yearCode!=null && acadYearDetails[0].yearCode!=''){
                    yearStr = acadYearDetails[0].yearCode.replace(/\s/g, "");
                    stuDyTab= yearStr.replace(/[^\w\s]/g, '')
                    console.log("stuDyTab::",stuDyTab);
                    let tableName = stuDyTab+"_students";
                    sql =  `SELECT dept,cls,sec,fc FROM ${tableName} WHERE stuRef=?`;
                    pool.query(sql,userData.userId.userData.sno,userData.body.acadYear,function(err,stuDynamicDetails){
                      sql = `SELECT catg from Feeses where stuRef=? and acadYear=? and status='active' and feeType='fee'`
                        if (err) {
                            callback({
                              "code":400,
                              "failed":"error ocurred"
                            })
                          }
                        else{
                            console.log("stuPrevData ::",stuDynamicDetails)
                            callback({"code":200,
                            "success":"Student Details Retrived Successfully",
                            "stuPrevData":stuDynamicDetails[0]});
                        }

                    })
                }
            }
            
        })
    }
}
module.exports = StuYear;