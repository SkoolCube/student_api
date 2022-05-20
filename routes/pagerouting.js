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
const stuatt = require("../core/stuatt/stuattendance");
const user = new finduser();
const stupaymentdetails = new stupayments();
const exam = new exams();
const stuYear = new stuAcadYear();
const stuattendance=new stuatt();

//This function is to verify the token

function verifyToken(req,res,next) {
    
    if(!req.headers.authorization) {
        return res.status(401).send('No token Provied')
    }
    let token = req.headers.authorization.split(' ')[1]
    
    if(token==='null') {
       return res.status(401).send('No token Provied')
    }
    let payload = jwt.verify(token, 'secreatkey');
    if(!payload) {
        return res.status(401).send('No token Provied')
    }
    req.userId = payload.subject;
   // console.log("uid ::",req.userId)
    next()
}


router.get('/',  (req, res, next) => {
    res.send("hello everyone");
})

//Login Function 
router.post('/login',(req,res,next)=>{
//checking username or password are undefined or not
console.log("helloooooo");
try{
    result=null
//login validation method
user.login(req.body.userName,req.body.password,function(result){ 
    console.log('result.userData::',result.code);
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
        console.log("res in else ::",result)
    }

    });
});
    }catch(err){
        console.log("username&password empty",err);
}
})

function getUserData(req,res,next){
   console.log("data :",req.userId.sno)

}


router.get('/paymentDetails',verifyToken,(req,res,callback)=>{
    stupaymentdetails.stufeedet(req,res,function(result){ 
        console.log("resp ::",result)
        result["auth-token"]=req.headers.authorization;
        console.log("header ::",req.headers.authorization)
        res.send(result)
    })

    
})



router.get('/stuattendance',verifyToken,(req,res,callback)=>{
    stuattendance.stuatt(req,res,function(result){ 
        console.log("resp ::",result)
        result["auth-token"]=req.headers.authorization;
        res.send(result)
    })

    
})

// Exam Details
router.get('/exam',verifyToken,(req,res,callback)=>{
    console.log("req::",req.userId.userData.sno);
    stuYear.getStuAcadYear(req,res,function(acadResult){ 
    acadResult['auth-token']=req.headers.authorization;
    console.log("acadResult::",acadResult);
    exam.examDetails(acadResult,res,function(result){ 
        res.send(result);
          
    })
        
    })
    
    
})
module.exports = router;
