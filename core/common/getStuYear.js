const pool=require('../dbconnect')
function StuYear(){};
StuYear.prototype = {
    getStuAcadYear : async function(userData, resp, callback){
        let yearStr="";
        let stuDyTab="";
        stuDet = [];
        let sql = await `SELECT * FROM Acadyear WHERE sno=?`;
        pool.query(sql,userData.body.acadYear,function(err,acadYearDetails){
          console.log("acadYearDetails :::",acadYearDetails)
            if (err) {
                callback({
                  "code":400,
                  "failed":"error ocurred"
                })
              }
            else{
                if(acadYearDetails[0].yearCode!=null && acadYearDetails[0].yearCode!=''){
                  stuDet.push(userData.userId.userData.sno);
                  stuDet.push(userData.body.acadYear);
                  let splCatg;
                    yearStr = acadYearDetails[0].yearCode.replace(/\s/g, "");
                    stuDyTab= yearStr.replace(/[^\w\s]/g, '')
                    let tableName = stuDyTab+"_students";
                    sql =  `SELECT dept,cls,sec,fc,stuRef FROM ${tableName} WHERE stuRef=?`;
                    pool.query(sql,userData.userId.userData.sno,function(err,stuDynamicDetails){
                      console.log("stuDynamicDetails ::"+stuDynamicDetails) 
                      if (err) {
                        callback({
                          "code":400,
                          "failed":"error ocurred"
                        })
                      }else{
                      sql = `SELECT catg from Feeses where stuRef=? and acadYear=? and status='active' and feeType='fee'`;
                      pool.query(sql,stuDet,function(err,specialFee){
                        console.log("specialFee[0].catg::",specialFee);
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
                          "acadYear":userData.body.acadYear
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