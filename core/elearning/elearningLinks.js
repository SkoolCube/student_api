const pool=require('../dbconnect')
function elearningLink(){
}
elearningLink.prototype = {
    getElearning : async function(userData, resp, callback){
        elaerningParams=[]
        elaerningParams.push(userData.userId.imsData.finGrp);
        elaerningParams.push(userData.userId.userData.cls);
        if(userData.userId.userData.cls==1732)
          elaerningParams.push(1675);
        else
          elaerningParams.push(userData.userId.userData.cls);
        elaerningParams.push(userData.userId.userData.sec);
        let sql = await `SELECT cls,subjRef,link from Elearning where branchId=? and (cls=? or cls=?) and (sec=? or sec=0) `;
        pool.query(sql,elaerningParams,function(err,elearnData){
          const clsNames = new Set();
            if (err) {
                callback({
                   "code":400,
                  "failed":"error ocurred while executing Gallery query"
                 })
               }
             else{
               if(elearnData!=null && elearnData!=''){
                 elearnMap=new Map();
                 elearnTempData=[]
                 clsData=[]
                 for(let i=0;i<elearnData.length;i++){
                  clsNames.add(elearnData[i].cls)
                  elearnTempData=elearnMap.get(elearnData[i].cls)
                  if(elearnTempData==null || elearnTempData=='')
                  elearnTempData=[]
                  elearnTempData.push(elearnData[i].subjRef)
                  elearnTempData.push(elearnData[i].link)
                  elearnMap.set(elearnData[i].cls,elearnTempData);

                 }
                 var ref=0;
                 elearnRefData=[]

                 clsMap=new Map()
                 clsMap.set(1675,"Junior Inter")
                 clsMap.set(1732,"Senior Inter")
                 clsMap.set(7778,"1st Year")
                 clsMap.set(7779,"2nd Year")
                 clsMap.set(2834,"3rd Year")
                 clsNames.forEach (function(clsRef) {
                  elearningLinks=[]
                  var n=1
                  for(let i=0;i<elearnMap.get(clsRef).length;i++){
                    tempLearnData=[]
                    tempLearnData2=[]
                    if(i % 2 == 0){
                      tempLearnData.push(elearnMap.get(clsRef)[i])
                    }
                    if(n % 2 != 0){
                      tempLearnData2.push(elearnMap.get(clsRef)[n])
                    }
                    if(i % 2 == 0){
                    elearningLinks.push({
                      "link":tempLearnData2[0],
                      "subject":tempLearnData[0],
                    })
                  }
                    n++;
                  }
                  if(elearningLinks!=null && elearningLinks!='' ){
                  elearnRefData.push({
                    "clsRef":clsMap.get(clsRef),
                   "elearnLink": elearningLinks
                })
              }
                })
                 
                callback({
                  "code":200,
                 "success":"Done",
                 "elearnData":elearnRefData
                })
                

               }
              else{
                callback({
                  "code":200,
                 "success":"Data not available"
                               })
              }
         }
        })
    }

}

module.exports = elearningLink;