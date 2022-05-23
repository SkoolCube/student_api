const express=require("express");
const convert = require('xml-js');
const jwt = require('jsonwebtoken');
const dbconnect = require("../core/dbconnect");
const router=express.Router();
const bcrypt = require('bcrypt');
const app = require("../app");
const finduser=require("../core/logincheck/finduser");
const stupayments=require("../core/logincheck/stupayments");
const exams = require("../core/exams_results/exams");
const stuAcadYear = require("../core/common/getStuYear");
const stuatt=require("../core/stuatt/stuattendance");
const stunotify=require("../core/common/stunotices");
const stuonlinecls = require("../core/onlinecls/stuonlinecls");
const events = require("../core/events/eventsdata.js");
const stuTimeTable=require("../core/timetable/stutimetable")
const user = new finduser();
const stupaymentdetails = new stupayments();
const exam = new exams();
const stuYear = new stuAcadYear();
const stuattdetails = new stuatt();
const stunotices = new stunotify();
const stuonlineclass=new stuonlinecls();
const branchEvents=new events();
const stuTT=new stuTimeTable();
//This function is to verify the token

function verifyToken(req,res,next) {
    
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized Request')
    }
    let token = req.headers.authorization.split(' ')[1]
    
    if(token==='null') {
       return res.status(401).send('Unauthorized Request')
    }
    let payload = jwt.verify(token, 'secreatkey');
    if(!payload) {
        return res.status(401).send('Unauthorized Request')
    }
    req.userId = payload.subject;
   // console.log("uid ::",req.userId)
    next()
}


router.get('/', verifyToken, (req, res, next) => {
    res.send("hello everyone");
})

//Login Function 
router.post('/login',(req,res,next)=>{
//checking username or password are undefined or not
try{
    result=null
//login validation method
console.log("userName :",req.body.userName)
user.login(req.body.userName,req.body.password,function(result){ 
    
    user.getImsbean(result.userData.compId,function(imsBean){
    //sendig response 
    if(result.code===200){
        result["imsBean"]=imsBean; 
        let payload = {subject:result}
        token = jwt.sign(payload,'secreatkey');
        result["auth-token"]=token;
        res.send(result);
    }else{
        res.send(result)
    }

    });
});
    }catch(err){
        console.log("username&password empty",err);
}
})

function getUserData(req,res,next){

}

router.get('/stuprofile',verifyToken,(req,res,callback)=>{
    stupaymentdetails.stufeedet(req,res,function(result){ 
        result['auth-token']=req.headers.authorization;
        res.send(result)
    })
})

router.get('/paymentDetails',verifyToken,(req,res,callback)=>{
    stupaymentdetails.stufeedet(req,res,function(result){ 
        result['auth-token']=req.headers.authorization;
        res.send(result)
    })
})

// Exam Details
router.get('/exam',verifyToken,(req,res,callback)=>{
    stuYear.getStuAcadYear(req,res,function(acadResult){ 
    acadResult['auth-token']=req.headers.authorization;
    acadResult['comp_id']=req.userId.userData.compId;
    acadResult['finGrp_id']=req.userId.imsBean.imsData.finGrp;
    exam.examDetails(acadResult,res,function(result){ 
        res.send(result);
          
    })
        
    })
})
//Student Attendance Details
router.get('/stuAttDetails',verifyToken,(req,res,callback)=>{
    //Monthwise student attendance 
    stuattdetails.stuAttdet(req,res,function(result){ 
         //Yearwise student attendance 
        stuattdetails.stuYearAttdet(req,res,function(yearResult){
            result["yearWise"]=yearResult
            result["auth-token"]=req.headers.authorization
            res.send(result)
        })
    })
})

//Student Notifications
router.get('/notify',verifyToken,(req,res,callback)=>{
    //Monthwise student attendance 
    stunotices.notices(req,res,function(result){ 
        res.send(result)
    })
})

//Student online class
router.get('/onlinecls',verifyToken,(req,res,callback)=>{
    stuonlineclass.onlinecls(req,res,function(result){  
        result["auth-token"]=req.headers.authorization;
        res.send(result)
    })
})

//Events
router.get('/eventsDet',verifyToken,(req,res,callback)=>{
    branchEvents.events(req,res,function(result){  
        result["auth-token"]=req.headers.authorization;
        res.send(result)
    })
})

router.get('/stutimetable',verifyToken,(req,res,callback)=>{
    stuTT.gettimetable(req,res,function(result){
        result["auth-token"]=req.headers.authorization;
        res.send(result)
    })
})

module.exports = router;