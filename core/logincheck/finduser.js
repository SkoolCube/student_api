const pool=require('../dbconnect')
const bcrypt = require('bcrypt');
const date = require('date-and-time')

function User() {};

User.prototype = {
    //login method
    login : function(username, password, callback){
    //Query building 
    var currentTime = new Date()
    console.log("test-1 ::",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))
    let sql = `SELECT s.sno,s.cls,s.sec,s.deptRef,s.compId,rollNo,nameF,nameL,mobF,fathName,gender,ph,dob,addr,nation,dateJ,email,marketSrc,followup,dateL,moles,hstl,trpt,uid,pwd,aadharNo,resvNo,feeCatg,s.acadYear,s.med,s.club,s.imgFolder,mt as motherTongue,tcOldNo as oldTcNo FROM Students as s WHERE uid = ? and status='active'`;
    pool.query(sql,username,function(err,usrDet){
      console.log("test-2 ",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))
        if (err) {
            callback({
              "code":400,
              "failed":"error ocurred"
            })
          }
        else{
        if(usrDet!=null && usrDet.length>0){
              
                console.log("final check-3 ",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))

    sql = `SELECT custId,finGrp,logType FROM Ims WHERE custId = ?`;
    pool.query(sql,usrDet[0].compId,function(err,imsBean){
      console.log("test-4 ",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))
        if (err) {
            callback({
              "code":400,
              "failed":"error ocurred"
            })
          }
        else{
        if(imsBean!=null && imsBean.length>0){
          console.log("test-5 ",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))
          sql="select compId as companyId,grpId,name,phNo,headName,mob,email,addr,city,imgFolder from Company where compId=?";
          pool.query(sql,usrDet[0].compId,function(err,compBean){
            console.log("test-6 ",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))
            stuClassData=[];
            var clsName ="0";
              if(usrDet[0]['cls']==1675)
              clsName="Junior Inter";
              else if(usrDet[0]['cls']==1732)
              clsName="Senior Inter";
              else if(usrDet[0]['cls']==7777)
              clsName="1st Year";
              else if(usrDet[0]['cls']==7778)
              clsName="2nd Year";
              else if(usrDet[0]['cls']==2834)
              clsName="3rd Year";
              else if(usrDet[0]['cls']==6054)
              clsName="Foundation";
              else if(usrDet[0]['cls']==7776)
              clsName="CMA-Inter";
              else if(usrDet[0]['cls']==7785)
              clsName="CA-Inter";
              else if(usrDet[0]['cls']==7780)
              clsName="Senior PU";
              else if(usrDet[0]['cls']==7779)
              clsName="Junior PU";

              sql="select section from Sections where sno=?";
              pool.query(sql,usrDet[0].sec,function(err,secData){
                console.log("test in sec ",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))
                stuData={
                  "clsName":clsName,
                  "secName":secData[0].section
                }
                callback({"code":200,
                "success":"Login SuccessfullLogin Successfull",
                "userData":usrDet[0],
                "imsData":imsBean[0],
                "compData":compBean[0],
                "stuDetails":stuData
              });

              })
          })
        }else{
        callback({"code":206,
        "success":"Ims data does not exits"})
        }
    }
    })
               
        }else{
        callback({
        "code":206,
        "success":"User does not exits"})
        }
    }
    })
},


getImsbean : async function(compId,callback){
  var currentTime = new Date()
  console.log("test-3 ",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))
    let sql = await `SELECT custId,finGrp,logType FROM Ims WHERE custId = ?`;
    pool.query(sql,compId,function(err,imsBean){
      console.log("test-4 ",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))
        if (err) {
            callback({
              "code":400,
              "failed":"error ocurred"
            })
          }
        else{
        if(imsBean!=null && imsBean.length>0){
          console.log("test-5 ",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))
          sql="select compId as companyId,grpId,name,phNo,headName,mob,email,addr,city,imgFolder from Company where compId=?";
          pool.query(sql,compId,function(err,compBean){
            console.log("test-6 ",date.format(currentTime,"YYYY-MM-DD HH:mm:ss"))
                callback({"code":200,
                "success":"Done",
                "imsData":imsBean[0],
                "compData":compBean[0]
              });
          })
        }else{
        callback({"code":206,
        "success":"Ims data does not exits"})
        }
    }
    })
},


getClassData : async function(finGrp,stuRef,callback){
    let sql = await `SELECT c.cls FROM Classes c,Students s WHERE s.cls=c.sno and c.compId = ? and s.sno=? and empStatus='approved'`;
    var tempData=[];
    tempData.push(finGrp);
    tempData.push(stuRef);
    pool.query(sql,tempData,function(err,clsBean){
        if (err) {
            callback({
              "code":400,
              "failed":"error ocurred"
            })
          }
        else{
        if(clsBean!=null && clsBean.length>0){
            
                callback({"code":200,
                "success":"Done",
                "clsData":clsBean});
                
        }else{
        callback({"code":206,
        "success":"Class data does not exits"})
        }
    }
    })
}

}



module.exports = User;

