const pool=require('../dbconnect')
const bcrypt = require('bcrypt');
function User() {};

User.prototype = {
    //login method
    custAdd : async function(data, callback){
        console.log(data);
        var client_series;
        var clientId = "";
        var strArr;
        if(data.type=='school')
            client_series = "SKOOLS";
        else
            client_series = "SKOOLC";
        
        let sql =await `SELECT client_id FROM client WHERE client_id is not null and client_id like ? order by client_id ASC`;
        pool.query(sql,client_series+"%",async function(err,id){
    if (err) {
                callback({
                  "code":400,
                  "failed":"error ocurred"
                })
              }
    else{
            strArr=id;
            if(strArr!=''){
                clientId =strArr[strArr.length-1].client_id;
            }else{
                clientId = "";
            }
            if(clientId==""){
                clientId = client_series+"000";
            }
            var str = clientId.substring(6);
            count = parseInt(str);
            if(count<9)
                clientId = client_series+"000"+(count+1);
            else if(count<99)
                clientId = client_series+"00"+(count+1);
            else if(count<999)
                clientId = client_series+"0"+(count+1);
            else
                clientId = client_series + (count+1);
    
            console.log("clientId",clientId);
            const userDetails={
                client_id : clientId,
                area : data.area,
                client_name : data.client_name,
                contact_num : data.contact_num,
                head_name : data.head_name,
                type : data.type,
                levels : data.levels,
                address : data.address
            };
            
            var sql1 =await 'INSERT INTO client SET ?';
            pool.query(sql1, userDetails,async function (err, clientData) { 
                if(err){
                callback({
                    "code":400,
                    "failed":"error ocurred while inserting in client table"
                  })
                 } else{
                    return userDetails.client_id;
                }
            });
            let tabName=userDetails.client_id+"_staff"
            console.log("tabname ",tabName)
            try{
            var sql2 =await `create table if not exists ${tabName} (STAFF_REF int (3) NOT NULL AUTO_INCREMENT PRIMARY KEY,STAFF_ID int (8),FIRST_NAME varchar (135),LAST_NAME varchar (135),ADDRESS varchar (135),PH_NO varchar (135),DATE_JOIN varchar (135),STATUS varchar (135),LEVEL varchar (135),DEPT_REF varchar (135),DESG_REF varchar (135),STAFF_TYPE varchar (135),DOB varchar (135),DOL varchar (135),IP varchar (135),SYS_TIME varchar (135))`;
           console.log("sql-2 ",sql2)
            pool.query(sql2,async function (err, clientData) { 
                if(err){
                    callback({
                        "code":400,
                        "failed":"error ocurred while Creating staff table"
                      })
                     }  else{
                    console.log("Staff Table Table Created with Client Id ",userDetails.client_id); 
                }
            });
        }catch (error) {
                
        }
            let staffTabName=userDetails.client_id+"_staff"
            user_id=userDetails.client_id
           
            for(let emp of data.empAddingArray){
                if(emp.first_name!=null && emp.first_name!=''){
                var empId = Math.floor(Math.random() * 99999) + 10000;
                empArray = {
                    staff_id : empId,
                    first_name : emp.first_name,
                    last_name : emp.last_name,
                    ph_no   : emp.ph_no,
                    dob :     emp.dob,
                    address   : emp.staff_address,
                    status  :   'active'
                }
                var sql3 =await `INSERT INTO ${staffTabName} SET ?`;
                console.log("user_id ",user_id)
                pool.query(sql3, empArray,async function (err, empData) { 
                    console.log("user_id-1 ",user_id)
                    if(err){
                        callback({
                            "code":400,
                            "failed":"error ocurred while Insertinng data into staff table"
                          })
                         } 
                    else{
                        console.log("empdata ::",empArray)
                        if(empData!=null){
                        staff_uid=empArray.first_name+""+empArray.last_name
                        staff_pwd=Math.floor(Math.random() * 99999) + 10000
                        console.log("sai")
                        console.log("logid ",user_id)
                        staffLogDetails={
                            CLIENT_ID : user_id,
                            LOG_ID : empArray.staff_id,
                            LOG_UID : staff_uid,
                            LOG_PWD :bcrypt.hashSync(staff_pwd+""+empArray.first_name,10)
                        }
                        console.log("data ::",staffLogDetails)

                        var sql4 =await `INSERT INTO staff_log_details SET ?`;
                        pool.query(sql4, staffLogDetails,async function (err, staffDetails){
                            if(err){
                                callback({
                                    "code":400,
                                    "failed":"error ocurred while Inserting staff log table"
                                  })
                                 } else{
                                    callback({
                                        "code":200,
                                        "success":"Staff UID & PWD Created",
                                        "staffdetails": staffLogDetails
                                      })
                                 }
                        })


                         }
                        
                    }
                   
                    
            }); 
         }
         }

        


            }
        })
        
    }

}

module.exports = User;

