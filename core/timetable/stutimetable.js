const pool=require('../dbconnect')
const date = require('date-and-time')

function stutimetable(){
}

stutimetable.prototype = {
    gettimetable : async function(userData, resp, callback){
        let sql = await `SELECT sno,subj,subjAcr from Subjects where compId=? `;
    pool.query(sql,userData.userId.imsBean.imsData.finGrp,function(err,subjData){
        let subjMap=new Map();
        for(let i=0;i<subjData.length;i++){
            subjMap.set(subjData[i].sno,subjData[i].subj+"~"+subjData[i].subjAcr)
        }
        sql = `SELECT * from PeriodTimings where compId=? and acadYear=?`;
        periodParams=[];
        periodParams.push(userData.userId.imsBean.imsData.finGrp)
        periodParams.push(userData.userId.userData.acadYear)
        
    pool.query(sql,periodParams,function(err,periodTimingData){
        let periodMap=new Map();
        for(let i=0;i<periodTimingData.length;i++){
            periodMap.set(periodTimingData[i].period,periodTimingData[i].perFrom+"~"+periodTimingData[i].perTo)
        }
        sql = `SELECT day,period,subjRef,t.empId,firstName,lastName from TimeTableAlloc t,Employees e where t.empId=e.empId and branchId=? and sec=? and acadYear=?`;
        timeTableParams=[];
        timeTableParams.push(userData.userId.userData.compId)
        timeTableParams.push(userData.userId.userData.club)
        timeTableParams.push(userData.userId.userData.acadYear)
        pool.query(sql,timeTableParams,function(err,timetabledata){
            timeTableArray=[]
            let weekMap=new Map();
            weekMap.set("Monday",1);
            weekMap.set("Tuesday",2);
            weekMap.set("Wednesday",3);
            weekMap.set("Thuday",4);
            weekMap.set("Friday",5);
            weekMap.set("Satday",6);
            if(timetabledata!=null &&  timetabledata!=''){
            for(let i=0;i<timetabledata.length;i++){
                timeTableArray.push({
                    "dayOfWeek":weekMap.get(timetabledata[i].day),
                    "period":timetabledata[i].period,
                    "nameSubj":subjMap.get(timetabledata[i].subjRef).split("~")[1],
                    "subjRef":timetabledata[i].subjRef,
                    "empId":timetabledata[i].empId,
                    "staffName":timetabledata[i].firstName+" "+timetabledata[i].lastName,
                    "timings":periodMap.get("period-"+timetabledata[i].period).split("~")[0]+" To "+periodMap.get("period-"+timetabledata[i].period).split("~")[1],
                })

            }
            callback({
                "code":200,
               "success":"Fetched data from Time table",
               "timeTable":timeTableArray,            
                  })
            }
            else{
                callback({
                "code":200,
               "success":"No data found in Time table",
                  })
            }
            
    })


    })


    })


}
}
module.exports = stutimetable;
