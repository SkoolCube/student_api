const pool=require('../dbconnect')
const date = require('date-and-time')
const res = require('express/lib/response')
function Studentattendance(){
}

Studentattendance.prototype = {
    stuAttdet : async function(stuData, resp, callback){
        var currentTime = new Date()
        var year = currentTime.getFullYear()
        var month = currentTime.getMonth() + 1
        if(stuData.body.month!=null && stuData.body.month!='')
          month=stuData.body.month;
        if(stuData.body.month!=null && stuData.body.month!='')
          year=stuData.body.year;  
        
        if(month<=9)
        month=0+""+month
        let sql = await `SELECT * from `+year+``+month+`_Attendance where ref=? and refType='stu'`;
    pool.query(sql,stuData.userId.userData.sno,function(err,stuAttData){
       
        if (err) {
            callback({
               "code":400,
              "failed":"error ocurred while running Attendance query"
             })
           }
         else if(stuAttData!=null && stuAttData.length>0){
          stuAttRespArray=[];
                  

                  stuAttRespData={
                    "01":stuAttData[0].att1,
                    "02":stuAttData[0].att2,
                    "03":stuAttData[0].att3,
                    "04":stuAttData[0].att4,
                    "05":stuAttData[0].att5,
                    "06":stuAttData[0].att6,
                    "07":stuAttData[0].att7,
                    "08":stuAttData[0].att8,
                    "09":stuAttData[0].att9,
                    "10":stuAttData[0].att10,
                    "11":stuAttData[0].att11,
                    "12":stuAttData[0].att12,
                    "13":stuAttData[0].att13,
                    "14":stuAttData[0].att14,
                    "15":stuAttData[0].att15,
                    "16":stuAttData[0].att16,
                    "17":stuAttData[0].att17,
                    "18":stuAttData[0].att18,
                    "19":stuAttData[0].att19,
                    "20":stuAttData[0].att20,
                    "21":stuAttData[0].att21,
                    "22":stuAttData[0].att22,
                    "23":stuAttData[0].att23,
                    "24":stuAttData[0].att24,
                    "25":stuAttData[0].att25,
                    "26":stuAttData[0].att26,
                    "27":stuAttData[0].att27,
                    "28":stuAttData[0].att28,
                    "29":stuAttData[0].att29,
                    "30":stuAttData[0].att30,
                    "31":stuAttData[0].att31
                  }

               
              leaveType=null; 
              holidayParams=[];
              holidayParams.push(stuData.userId.userData.compId)
              holidayParams.push(month)
              holidayParams.push(year)
              sql = `SELECT day(date) as day,date,notes from Holidays where compId=? and month(date)=? and year(date)=?`;
              pool.query(sql,holidayParams,function(err,holidayData){
                holidayArray=[];
                let holidayCheckMap=new Map();
              for(let i=0;i<holidayData.length;i++){
                holidayCheckMap.set("day"+holidayData[i].day,"H~"+holidayData[i].notes) 
              }

              Object.keys(stuAttRespData).forEach(function(key) {
                leaveType=null; 
                holidayNote="";
                //console.log("holidayCheckMap :",holidayCheckMap.get("day"+key).split("~")[0]+" :: "+key)  
                if(stuAttRespData[key]==='P')
                  leaveType=1;
                else if(holidayCheckMap.get("day"+key)!=null && holidayCheckMap.get("day"+key)!='undefined' && holidayCheckMap.get("day"+key).split("~")[0]==='H'){
                  leaveType=3;
                  holidayNote=holidayCheckMap.get("day"+key).split("~")[1];
                 } else
                  leaveType=2; 
                stuAttRespArray.push({
                "month":month,
                "year":year,
                "leaveType":leaveType,
                "day":key,
                "holidayNote":holidayNote
                })
              })
             
              callback({
                "code":200,
               "success":"Attendance data fetched",
               "stuAttRespMonthArray":stuAttRespArray
              })

              })

                 
        }
        else{
          callback({
            "code":200,
           "success":"Attendance data not found for this student on this month"
          })
         }
  

    })
  },

  stuYearAttdet : async function(stuData, resp, callback){
    var currentTime = new Date()
   let totIncr=0;
    yearWiseStuAtt=[];
        var year = currentTime.getFullYear()
        var month = currentTime.getMonth() + 1
       let sql = `SELECT * from Acadyear where grpId=? and curtYear=1`;
       pool.query(sql,stuData.userId.imsData.finGrp,function(err,acadData){
         year1=acadData[0].yearCode.split("-")[0]
         year2=acadData[0].yearCode.split("-")[1]
    for(let i=1;i<=12;i++){
     let present=0;
     let absent=0;
     let holiday=0;
     month="";
     year="";
      if(i>=1 && i<6)
        year=year2;
      else
        year=year1;

      if(i<=9)
        month=0+""+i;
      else
        month=i;
        let sql="";
      sql = `SELECT * from `+year+``+month+`_Attendance where ref=? and refType='stu'`;
      pool.query(sql,stuData.userId.userData.sno,function(err,stuAttData){
        totIncr++;
        if (err) {
         
         }
       else if(stuAttData!=null && stuAttData.length>0){
        stuAttRespYearData=null;
                stuAttRespYearData={
                  "01":stuAttData[0].att1,
                  "02":stuAttData[0].att2,
                  "03":stuAttData[0].att3,
                  "04":stuAttData[0].att4,
                  "05":stuAttData[0].att5,
                  "06":stuAttData[0].att6,
                  "07":stuAttData[0].att7,
                  "08":stuAttData[0].att8,
                  "09":stuAttData[0].att9,
                  "10":stuAttData[0].att10,
                  "11":stuAttData[0].att11,
                  "12":stuAttData[0].att12,
                  "13":stuAttData[0].att13,
                  "14":stuAttData[0].att14,
                  "15":stuAttData[0].att15,
                  "16":stuAttData[0].att16,
                  "17":stuAttData[0].att17,
                  "18":stuAttData[0].att18,
                  "19":stuAttData[0].att19,
                  "20":stuAttData[0].att20,
                  "21":stuAttData[0].att21,
                  "22":stuAttData[0].att22,
                  "23":stuAttData[0].att23,
                  "24":stuAttData[0].att24,
                  "25":stuAttData[0].att25,
                  "26":stuAttData[0].att26,
                  "27":stuAttData[0].att27,
                  "28":stuAttData[0].att28,
                  "29":stuAttData[0].att29,
                  "30":stuAttData[0].att30,
                  "31":stuAttData[0].att31
                }
                present=0;
                absent=0;
                holiday=0;
                Object.keys(stuAttRespYearData).forEach(function(key) {
                  if(stuAttRespYearData[key]==='P')
                    present++;
                  else if(stuAttRespYearData[key]==='H')
                    holiday++;
                  else
                    absent++;

                })

                yearWiseStuAtt.push({
                  "year":sql.split(" ")[3].substring(0, 4),
                  "month":sql.split(" ")[3].substring(4, 6),
                  "present":present,
                  "absent":absent,
                  "holiday":holiday,
                  "total":present+absent
                })

              }

      if(totIncr===12){
              callback({
                "code":200,
               "success":"Done",
               "yearWiseStuAtt":yearWiseStuAtt,
               "acadyear":acadData[0].yearCode
              })
            }
      })
  }
 
})
  }


    }

module.exports = Studentattendance;