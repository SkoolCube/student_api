const pool=require('../dbconnect')
const bcrypt = require('bcrypt');


function User() {};

User.prototype = {
    //login method
    login : async function(username, password, callback){
    //Query building 
    console.log("userName::",username);
    let sql = await `SELECT c.cls as clsName,sec.section as secName,d.dept as deptName,s.sno,s.cls,s.sec,s.deptRef,s.compId,rollNo,nameF,nameL,mobF,fathName,gender,ph,dob,addr,nation,dateJ,email,marketSrc,followup,dateL,moles,hstl,trpt,uid,pwd,aadharNo,resvNo,feeCatg,s.acadYear FROM Students s,Classes c,Sections sec,Departments d WHERE uid = ? and s.cls=c.sno and s.sec=sec.sno and s.deptRef=d.sno and status='active'`;
    console.log("sql::",sql);
    pool.query(sql,username,function(err,usrDet){
        if (err) {
            callback({
              "code":400,
              "failed":"error ocurred"
            })
          }
        else{
        if(usrDet!=null && usrDet.length>0){
            
            // if(bcrypt.compareSync(password, usrDet[0].pwd)) {
            //     // return his data.
            //     callback({"code":200,
            //     "success":"Login Successfull",
            //     "userData":usrDet[0]});
            // }  else{
                callback({"code":200,
                "success":"Login Successfull",
                "userData":usrDet[0]});
                // callback({"code":204,
                // "success":"UserId and password does not match"})
            // }
        }else{
        callback({"code":206,
        "success":"User does not exits"})
        }
    }
    })
},


getImsbean : async function(compId,callback){
    let sql = await `SELECT * FROM Ims WHERE custId = ?`;
    console.log("sql::",sql);
    pool.query(sql,compId,function(err,imsBean){
        if (err) {
            callback({
              "code":400,
              "failed":"error ocurred"
            })
          }
        else{
        if(imsBean!=null && imsBean.length>0){
            
                callback({"code":200,
                "success":"Done",
                "imsData":imsBean[0]});
                
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

