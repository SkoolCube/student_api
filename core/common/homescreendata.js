const pool=require('../dbconnect')
const date = require('date-and-time')
var moment = require('moment');
function homescreendata(){

}

homescreendata.prototype = {
    //login method
    getHomescreenData : async function(userData, resp, callback){
        let feeByClsMap=new Map();
        let fee=0;
        let concs=0;
        let paid=0;
        let balance=0;
        let dueDate=0;
    //Query building 
    
    feeByclsParams=[];
    feeByclsParams.push(userData.userId.imsData.finGrp);
    feeByclsParams.push(userData.userId.userData.cls);
    feeByclsParams.push(userData.userId.userData.sec);
    feeByclsParams.push(userData.userId.userData.deptRef);
    feeByclsParams.push(userData.userId.userData.acadYear);
    feeByclsParams.push(userData.userId.userData.feeCatg);
    
     let sql = await `SELECT  * from Feesesbycls where compId=? and cls=? and (sec=? or sec=0) and deptRef=? and acadYear=? and feeCatg=?`;
    pool.query(sql,feeByclsParams,function(err,feeByClsData){
         if (err) {
            callback({
               "code":400,
              "failed":"error ocurred while running Feebycls query"
             })
           }
         else if(feeByClsData!=null && feeByClsData.length>0){
                 for (let i = 0; i < feeByClsData.length; i++) {
                    feeByClsMap.set(feeByClsData[i].catgRef+"~"+feeByClsData[i].term+"~fee",feeByClsData[i].amount);
                    if(feeByClsData[i].schlr!=null && feeByClsData[i].schlr>0)
                    feeByClsMap.set(feeByClsData[i].catgRef+"~"+feeByClsData[i].term+"~schlr",feeByClsData[i].schlr);
                if(feeByClsData[i].dueDate!=null && (feeByClsData[i].catgRef=='catg-001' || feeByClsData[i].catgRef=='catg-059'))
                dueDate=date.format(feeByClsData[i].dueDate,"YYYY-MM-DD")  
                }
        }
        
     
     feeByStuParams=[];
     feeByStuParams.push(userData.userId.userData.sno);
     feeByStuParams.push(userData.userId.userData.acadYear);
     sql = `SELECT amount1,amount2,amount3,feeType,catg from Feeses where stuRef=? and acadYear=? and status='active' and amount1 is not null`;
     pool.query(sql,feeByStuParams,function(err,feeByStuData){
        if (err) {
           callback({
              "code":400,
             "failed":"error ocurred while running feeses query"
            })
          }
        else if(feeByStuData!=null && feeByStuData.length>0){
                term=1;
                 for (let i = 0; i < feeByStuData.length; i++) {
                   if(feeByStuData[i].amount1!=null && feeByStuData[i].amount2!=null && feeByStuData[i].amount3!=null && feeByStuData[i].amount1>0 && feeByStuData[i].amount2>0 && feeByStuData[i].amount3>0){
                    term=3;
                   }
                   else if(feeByStuData[i].amount1!=null && feeByStuData[i].amount2!=null && feeByStuData[i].amount1>0 && feeByStuData[i].amount2>0){
                    term=2;
                   }
                  
                for(let tempterm=0;tempterm<term;tempterm++){
                   
                    if(tempterm===0)
                    feeByClsMap.set(feeByStuData[i].catg+"~"+(tempterm+1)+"~"+feeByStuData[i].feeType,feeByStuData[i].amount1);
                    else if(tempterm===1)
                    feeByClsMap.set(feeByStuData[i].catg+"~"+tempterm+1+"~"+feeByStuData[i].feeType,feeByStuData[i].amount2);
                    else if(tempterm===2)
                    feeByClsMap.set(feeByStuData[i].catg+"~"+tempterm+1+"~"+feeByStuData[i].feeType,feeByStuData[i].amount3);
                    
                }

                 }

                 
                for(const [key,value] of feeByClsMap){ 
                    if(key.split('~')[2]==='fee'){
                        fee+=value;
                    }
                    else if(key.split('~')[2]==='concs' || key.split('~')[2]==='schlr' || key.split('~')[2]==='brDisc'){
                        concs+=value;
                    }

                }
              
       }
    if(fee!=null && fee>0){
    incomeStuParams=[];
    incomeStuParams.push(userData.userId.userData.sno);
    incomeStuParams.push(userData.userId.userData.acadYear);
    incomeStuParams.push(userData.userId.imsData.finGrp);
   
    sql = `SELECT id.catg,id.term,recNo,i.date,i.compId,i.payMode,SUM(id.amount+(id.amount*COALESCE(id.tax,0)/100)) as amount,printHead from Income i,Incomedetails id,Feeheads f where i.sno=id.incRef and id.catg=f.catg and i.id=? and i.year=? and i.status='active' and id.status='active' and id.catg!='oth' and f.compId=? group by recNo,id.catg,id.term`;
     pool.query(sql,incomeStuParams,function(err,stuPaidDetails){
        if (err) {
            callback({
               "code":400,
              "failed":"error ocurred while running Income query"
             })
           }
         else if(stuPaidDetails!=null && stuPaidDetails.length>0){
            for(let stuInc=0;stuInc<stuPaidDetails.length;stuInc++){
                paid+=stuPaidDetails[stuInc].amount;
               }
            balance=fee-concs-paid;
           
         }
         else{
          balance=fee-concs;
         }

         var currentTime = new Date()
         var curDate=date.format(currentTime,"YYYY-MM-DD")
         if(balance>0 && dueDate!='0'){
         
         var diffInTime=0;
         var diffDays=0;
         var delayMsg="";
         diffInTime=moment(dueDate).diff(curDate)
            diffDays=diffInTime/(1000 * 3600 * 24);
            if(diffDays<0)
                delayMsg=-1*diffDays +" Days delay"
            else
                delayMsg="Due in "+diffDays+" Days"
         }
         else if(dueDate=='0')
         delayMsg=""
         else
             delayMsg="Upto date"

             sql = `SELECT count(noticeRef) as count from Notices where noticeTo=? and status='pending' group by noticeTo`  ;
             pool.query(sql,userData.userId.userData.sno,function(err,stuNotices){
                 var noticeCount=0;
                if(stuNotices!=null &&  stuNotices!=''){
                    noticeCount=stuNotices[0]["count"]
                }
                var homeScreenData=[]
                homeScreenData={
                    "fee_due":balance,
                    "delay_msg":delayMsg,
                    "count":noticeCount
                }
       
                    callback({
                       "code":200,
                      "success":"Done",
                      "homeScrnData":homeScreenData
                     })
       
       

             })

     })

    }else{
      callback({
        "code":400,
       "failed":"Fee is null"
      })
    }

    })

     })
     
     
}
}



module.exports = homescreendata;