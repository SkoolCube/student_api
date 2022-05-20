const pool=require('../dbconnect')

function Stupayments(){

}

Stupayments.prototype = {
    //login method
    stufeedet : async function(userData, resp, callback){
        let feeByClsMap=new Map();
        let fee=0;
        let concs=0;
        let paid=0;
        let balance=0;
    //Query building 
    
    feeByclsParams=[];
    feeByclsParams.push(userData.userId.imsBean.imsData.finGrp);
    feeByclsParams.push(userData.userId.userData.cls);
    feeByclsParams.push(userData.userId.userData.sec);
    feeByclsParams.push(userData.userId.userData.deptRef);
    feeByclsParams.push(userData.userId.userData.acadYear);
    feeByclsParams.push(userData.userId.userData.feeCatg);
    console.log("feeByclsParams ::",feeByclsParams) 
     let sql = await `SELECT  * from Feesesbycls where compId=? and cls=? and (sec=? or sec=0) and deptRef=? and acadYear=? and feeCatg=?`;
     
    pool.query(sql,feeByclsParams,function(err,feeByClsData){
         if (err) {
            callback({
               "code":400,
              "failed":"error ocurred"
             })
           }
         else{
           
        if(feeByClsData!=null && feeByClsData.length>0){
                 
                 
                  for (let i = 0; i < feeByClsData.length; i++) {
                   
                    feeByClsMap.set(feeByClsData[i].catgRef+"~"+feeByClsData[i].term+"~fee",feeByClsData[i].amount);
                    if(feeByClsData[i].schlr!=null && feeByClsData[i].schlr>0)
                    feeByClsMap.set(feeByClsData[i].catgRef+"~"+feeByClsData[i].term+"~schlr",feeByClsData[i].schlr);
                  }
                  console.log("map ::",feeByClsMap)
                stuFeeData=  feeByClsData;
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
             "failed":"error ocurred"
            })
          }
        else{
          
       if(feeByStuData!=null && feeByStuData.length>0){
                term=1;
                 for (let i = 0; i < feeByStuData.length; i++) {
                   if(feeByStuData[i].amount1!=null && feeByStuData[i].amount2!=null && feeByStuData[i].amount3!=null && feeByStuData[i].amount1>0 && feeByStuData[i].amount2>0 && feeByStuData[i].amount3>0){
                    term=3;
                   }
                   else if(feeByStuData[i].amount1!=null && feeByStuData[i].amount2!=null && feeByStuData[i].amount1>0 && feeByStuData[i].amount2>0){
                    term=2;
                   }
                   console.log("term ::",term.length)
                for(let tempterm=0;tempterm<term;tempterm++){
                   console.log("sai")
                    if(tempterm===0)
                    feeByClsMap.set(feeByStuData[i].catg+"~"+(tempterm+1)+"~"+feeByStuData[i].feeType,feeByStuData[i].amount1);
                    else if(tempterm===1)
                    feeByClsMap.set(feeByStuData[i].catg+"~"+tempterm+1+"~"+feeByStuData[i].feeType,feeByStuData[i].amount2);
                    else if(tempterm===2)
                    feeByClsMap.set(feeByStuData[i].catg+"~"+tempterm+1+"~"+feeByStuData[i].feeType,feeByStuData[i].amount3);
                    
                }

                 }

                 console.log("map-1 ::",feeByClsMap)

                for(const [key,value] of feeByClsMap){
                    console.log("type ::",key.split('~')[2])
                    if(key.split('~')[2]==='fee'){
                        fee+=value;
                    }
                    else if(key.split('~')[2]==='concs' || key.split('~')[2]==='schlr' || key.split('~')[2]==='brDisc'){
                        concs+=value;
                    }

                }
               console.log("fee ::"+fee+" :: "+concs) 
       }
    }
    incomeStuParams=[];
    incomeStuParams.push(userData.userId.userData.sno);
    incomeStuParams.push(userData.userId.userData.acadYear);
   
    sql = `SELECT catg,term,recNo,compId,payMode,SUM(id.amount+(id.amount*COALESCE(id.tax,0)/100)) as amount from Income i,Incomedetails id where i.sno=id.incRef and i.id=? and year=? and i.status='active' and id.status='active' and catg!='oth' group by recNo,catg,term`;
     pool.query(sql,incomeStuParams,function(err,stuPaidDetails){
        if (err) {
            callback({
               "code":400,
              "failed":"Income error ocurred"
             })
           }
         else{
             console.log("stuPaidDetails ::"+stuPaidDetails)
            for(let stuInc=0;stuInc<stuPaidDetails.length;stuInc++){
                paid+=stuPaidDetails[stuInc].amount;
            }
            console.log("paid ::",paid)
            balance=fee-concs-paid;
            console.log("balance ::",balance)
            paymentdata={
              "fee":fee,
              "concs":concs,
              "paid":paid,
              "balance":balance
            }
            callback({
              "code":200,
             "success":"Done",
             "paymentdata":paymentdata
            })

         }
     })


    })

     })
     
     
}
}



module.exports = Stupayments;