const pool=require('../dbconnect')
function galleryData(){
}
galleryData.prototype = {
    getGallery : async function(userData, resp, callback){
        let sql = await `SELECT ref,branchId,imgTitle,imgFolder from Gallery where branchId=? order by sysTime desc`;
        pool.query(sql,userData.userId.userData.compId,function(err,gallery){

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
               "gallery":gallery
              })
         }
        })
    }

}

module.exports = galleryData;