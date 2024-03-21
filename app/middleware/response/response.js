const response = (res,status,success,message,result="")=>{

    res.status(status).json({
         success:success,
         message:message,
         result:result
     })
 }
 
 
 module.exports = {response}