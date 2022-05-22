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
        examParms.push(acadResult.comp_id);
        examParms.push(acadResult.splCatg);
        if(examParms[5]!=null && examParms[5]!=''){
            SPL_CATG_CODE = " and splCourse like '%" + examParms[5] + "%'";
        }else{
            SPL_CATG_CODE = "";
        }

        if(examParms[4]!=null && examParms[4]!=''){
            COMP = " and applTo like '%" + examParms[4] + "%'";
        }else{
            COMP = "";
        }


        let sql = await `SELECT examRef,exam,acr FROM Exams  WHERE dept=? AND cls=? AND sec=? AND acadYear=? `+COMP +` `+SPL_CATG_CODE;
        pool.query(sql,examParms,function(err,examDetails){
            if (err) {
                callback({
                  "code":400,
                  "failed":"error ocurred"
                })
            }else{
                
                examFinalData=[];

                let prevExamRef=0;
                var exmIncr=0;
                for(let exam = 0; exam < examDetails.length; exam++){
                    sql = `SELECT ettRef,subj,date,min,max,duration FROM GVTGRP0013_ett et,Subjects s WHERE et.subRef=s.sno AND examRef=?`;
                    ettParams=[];
                    
                    ettParams.push(examDetails[exam].examRef)
                    ettParams.push(examDetails[exam].exam)
                    ettParams.push(examDetails[exam].acr)
                    pool.query(sql,ettParams,function(err,exmTimeTblDetails){
                        if(prevExamRef!=examDetails[exam].examRef)
                        exmIncr++;

                        if (err) {
                        }else{
                            exmEttData=[]
                exmData=[]
                            for(let ett=0;ett<exmTimeTblDetails.length;ett++){
                                exmEttData.push({
                                    "ettRef":exmTimeTblDetails[ett].ettRef,
                                    "subjName":exmTimeTblDetails[ett].subj,
                                    "date":exmTimeTblDetails[ett].date,
                                    "min":exmTimeTblDetails[ett].min,
                                    "max":exmTimeTblDetails[ett].max,
                                    "duration":exmTimeTblDetails[ett].duration
                                })
                            }

                            exmData={
                                "examRef":examDetails[exam].examRef,
                                "examName":examDetails[exam].exam,
                                "ettData":exmEttData
                            }
                         
                            examFinalData.push({
                                "examDetails":exmData
                            })
                            prevExamRef=examDetails[exam].examRef;
                            if(exmIncr==examDetails.length){
                            callback({"code":200,
                             "success":"Exam Details Retrived Successfully",
                             "examFinalDetails":examFinalData
                         }); 
                        }
                    
                        }
                    })
                }
                
            }
            
        })
    }
}
module.exports = Examdet;