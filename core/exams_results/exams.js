const pool=require('../dbconnect');

function Examdet(){};
Examdet.prototype = {
    examDetails : async function(acadResult, resp, callback){
        let SPL_CATG_CODE;
        examParms = [];
        examParms.push(acadResult.stuPrevData.dept);
        examParms.push(acadResult.stuPrevData.cls);
        examParms.push(acadResult.stuPrevData.sec);
        examParms.push(acadResult.acadYear);
        examParms.push(acadResult.splCatg);
        if(examParms[4]!=null && examParms[4]!=''){
            SPL_CATG_CODE = " and splCourse like '%" + examParms[4] + "%'";
        }else{
            SPL_CATG_CODE = "";
        }
        let sql = await `SELECT examRef,exam,acr FROM Exams  WHERE dept=? AND cls=? AND sec=? AND acadYear=? `+SPL_CATG_CODE;
        pool.query(sql,examParms,function(err,examDetails){
            if (err) {
                callback({
                  "code":400,
                  "failed":"error ocurred"
                })
            }else{
                for(let exam = 0; exam < examDetails.length; exam++){
                    sql = `SELECT ettRef,subj,date,min,max,duration FROM GVTGRP0013_ett et,Subjects s WHERE et.subRef=s.sno AND examRef=?`;
                    pool.query(sql,examDetails[exam].examRef,function(err,exmTimeTblDetails){
                        if (err) {
                            callback({
                              "code":400,
                              "failed":"error ocurred"
                            })
                        }else{
                            callback({"code":200,
                            "success":"Exam Details Retrived Successfully",
                            "examDetails":examDetails[0],
                            "exmTimeTblDetails":exmTimeTblDetails
                        }); 
                        }
                    })
                }
                
            }
            
        })
    }
}
module.exports = Examdet;