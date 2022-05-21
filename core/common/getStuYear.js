const pool=require('../dbconnect')
function StuYear(){};
StuYear.prototype = {
    getStuAcadYear : async function(userData, resp, callback){
        let yearStr="";
        let stuDyTab="";
        stuDet = [];
        let sql = await `SELECT * FROM Acadyear WHERE sno=?`;
        pool.query(sql,userData.userId.userData.acadYear,function(err,acadYearDetails){
            if (err) {
                callback({
                  "code":400,
                  "failed":"error ocurred"
                })
              }
            else{
                if(acadYearDetails[0].yearCode!=null && acadYearDetails[0].yearCode!=''){
                  stuDet.push(userData.userId.userData.sno);
                  stuDet.push(userData.userId.userData.acadYear);
                  let splCatg;
                    yearStr = acadYearDetails[0].yearCode.replace(/\s/g, "");
                    stuDyTab= yearStr.replace(/[^\w\s]/g, '')
                    let tableName = stuDyTab+"_students";
                    sql =  `SELECT dept,cls,sec,fc FROM ${tableName} WHERE stuRef=?`;
                    pool.query(sql,userData.userId.userData.sno,function(err,stuDynamicDetails){
                      if (err) {
                        callback({
                          "code":400,
                          "failed":"error ocurred"
                        })
                      }else{
                      sql = `SELECT catg from Feeses where stuRef=? and acadYear=? and status='active' and feeType='fee'`;
                      pool.query(sql,stuDet,function(err,specialFee){
                        
                        if (err) {
                          callback({
                            "code":400,
                            "failed":"error ocurred"
                          })
                        }
                        else{
                          if(specialFee!=null && specialFee!=''){
                            splCatg = specialFee[0].catg
                          }else{
                            splCatg = '';
                          }
                          
                          callback({"code":200,
                          "success":"Student Details Retrived Successfully",
                          "stuPrevData":stuDynamicDetails[0],
                          "splCatg":splCatg,
                          "acadYear":userData.userId.userData.acadYear
                          });
                      }
                      })
                    }
                    })
                }
            }
            
        })
    }
}
module.exports = StuYear;