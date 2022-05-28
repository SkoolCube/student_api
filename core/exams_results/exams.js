const pool=require('../dbconnect');

function Examdet(){};
Examdet.prototype = {
    examDetails : function(acadResult, resp, callback){
        let SPL_CATG_CODE;
        examParms = [];
        examParms.push(acadResult.stuPrevData.dept);
        examParms.push(acadResult.stuPrevData.cls);
        examParms.push(acadResult.stuPrevData.sec);
        examParms.push(acadResult.acadYear);
        examParms.push(acadResult.comp_id);
        examParms.push(acadResult.splCatg);
        if(examParms[5]!=null && examParms[5]!=''){
            SPL_CATG_CODE = " and (( splCourse like '%" + examParms[5] + "%' and splCrsSel='onlySpl' ) or (splCrsSel='all' or splCrsSel is null))";
        }else{
            SPL_CATG_CODE = " and (splCrsSel!='onlySpl' or splCrsSel is null or splCrsSel='')";
        }

        if(examParms[4]!=null && examParms[4]!=''){
            COMP = " and applTo like '%" + examParms[4] + "%'";
        }else{
            COMP = "";
        }


        let sql = `SELECT examRef,exam,acr FROM Exams  WHERE dept=? AND cls=? AND sec=? AND acadYear=? `+COMP +` `+SPL_CATG_CODE+" order by sysTime Desc";
        pool.query(sql,examParms,function(err,examDetails){
            if (err) {
                callback({
                  "code":400,
                  "failed":"error ocurred in exam query"
                })
            }else if(examDetails!=null && examDetails!=''){
                
                examFinalData=[];

                let prevExamRef=0;
                var exmIncr=0;
                for(let exam = 0; exam < examDetails.length; exam++){
                    sql = `SELECT ettRef,subj,date,min,max,duration,et.subRef,et.examRef FROM GVTGRP0013_ett et,Subjects s WHERE et.subRef=s.sno AND examRef=? order by date`;
                    ettParams=[];
                    
                    ettParams.push(examDetails[exam].examRef)
                    ettParams.push(examDetails[exam].exam)
                    ettParams.push(examDetails[exam].acr)
                    pool.query(sql,ettParams,function(err,exmTimeTblDetails){
                        if (err) {
                        }else{
                          
                             if(exmTimeTblDetails!=null){
                                 resParams=[]
                                 resParams.push(acadResult.stuPrevData.stuRef)
                                 resParams.push(examDetails[exam].examRef);
                            sql=`SELECT max,min,r.* FROM GVTGRP0013_res r,GVTGRP0013_ett et WHERE r.examRef=et.examRef AND r.subRef=et.subRef AND stuRef=? AND et.examRef=? GROUP BY et.examRef,stuRef,et.subRef,r.subRef`
                            pool.query(sql,resParams,function(err,stuResData){
                                if(prevExamRef!=examDetails[exam].examRef)
                                exmIncr++;
                                resStuMap=new Map();
                                for(let res=0;res<stuResData.length;res++){
                                    tempData=[]
                                    tempData.push(stuResData[res].examMarks)
                                    tempData.push(stuResData[res].max)
                                    resStuMap.set(stuResData[res].examRef+"~"+stuResData[res].subRef,tempData)
                                }
                                exmEttData=[]
                                exmData=[]
                                examWiseTot=0;
                                maxMarks=0;
                            for(let ett=0;ett<exmTimeTblDetails.length;ett++){
                                if(resStuMap!=null && resStuMap.get(exmTimeTblDetails[ett].examRef+"~"+exmTimeTblDetails[ett].subRef)!=null && resStuMap.get(exmTimeTblDetails[ett].examRef+"~"+exmTimeTblDetails[ett].subRef)[0]!=null ){
                                marks=resStuMap.get(exmTimeTblDetails[ett].examRef+"~"+exmTimeTblDetails[ett].subRef)[0]
                                if(marks!='A' && marks!='AB' && marks!='ABS' && marks!='-' && marks!='' && marks!='NE'){
                                examWiseTot=(examWiseTot+parseInt(marks));
                                maxMarks=maxMarks+resStuMap.get(exmTimeTblDetails[ett].examRef+"~"+exmTimeTblDetails[ett].subRef)[1]
                                }
                            }else
                               marks="NA";

                               exmEttData.push({
                                    "ettRef":exmTimeTblDetails[ett].ettRef,
                                    "subjName":exmTimeTblDetails[ett].subj,
                                    "date":exmTimeTblDetails[ett].date,
                                    "min":exmTimeTblDetails[ett].min,
                                    "max":exmTimeTblDetails[ett].max,
                                    "duration":exmTimeTblDetails[ett].duration,
                                    "subRef":exmTimeTblDetails[ett].subRef,
                                    "marks":marks
                                })
                            }
                            perc=examWiseTot*100/maxMarks;
                            if(perc>=75)
                            grade="A"
                            else if(perc>=60 && perc<75)
                            grade="B"
                            else if(perc>=50 && perc<60)
                            grade="C"
                            else if(perc>=35 && perc<50)
                            grade="D"
                            else
                            grade="E"

                            exmData={
                                "examRef":examDetails[exam].examRef,
                                "examName":examDetails[exam].exam,
                                "examTotMarks":examWiseTot,
                                "perc":perc,
                                "grade":grade,
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
                    })
                             }
                        }
                    })
                }
                
            }
            else{
                callback({"code":200,
                             "success":"Exam Details not Added"
                          }); 
            }
            
        })
    }
}
module.exports = Examdet;