const pool=require('../dbconnect')
function elearningLink(){
}
elearningLink.prototype = {
    getElearning : async function(userData, resp, callback){
        elaerningParams=[]
        elaerningParams.push(userData.userId.imsData.finGrp);
        elaerningParams.push(userData.userId.userData.cls);
        elaerningParams.push(userData.userId.userData.sec);
        console.log("elaerningParams ",elaerningParams)
        let sql = await `SELECT subjRef,link from Elearning where branchId=? and cls=? and (sec=? or sec=0) `;
        pool.query(sql,elaerningParams,function(err,elearnData){

            if (err) {
                callback({
                   "code":400,
                  "failed":"error ocurred while executing Gallery query"
                 })
               }
             else{
               callback({
                "code":200,
               "success":"Done",
               "elearnData":elearnData
              })
         }
        })
    }

}

module.exports = elearningLink;