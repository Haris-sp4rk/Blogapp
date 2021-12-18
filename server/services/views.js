const mysql = require('../db/connectDB.js');

const incviews = async ({email:_email,handle:_handle})=>{
  if (_email){
    let query=`UPDATE Blog SET Views = Views +1 WHERE Email='${_email}'`;
    try {
        [result] = await mysql.connection.query(__query);
    
      } catch (error) {
        return ({ status: false });
      }

  }else if(_handle){
    let query=`UPDATE Blog SET Views = Views +1 WHERE handle='${_handle}'`;
    try {
        [result] = await mysql.connection.query(__query);
    
      } catch (error) {
        return ({ status: false });
      }
  }else{
    return ({ status: false });
  }
  
}
module.exports.incviews =incviews;