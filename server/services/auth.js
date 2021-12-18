const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('../db/connectDB.js');
require('dotenv').config();

const verifyUserCredentials = async ({ email: __email, password: __password }) => {
  
  // Checking if the user exists within the database
  let __query = `SELECT Password FROM BLOGGING.Users WHERE Email='${__email}'`;
  let result;
  
  try {
    [result] = await mysql.connection.query(__query);

    // If no such email, throw an error
    if ([result[0]][0] === undefined) throw new Error('No such email exists.');
  } catch (error) {
    return ({ status: false, handle: undefined });
  }

  // Extract the DB obtained password
  const passwordFromDatabase = result[0].Password;
  let compare;

  // Compare both with bcrypt
  try {
    compare = await bcrypt.compare(__password, passwordFromDatabase);
  } catch (error) {
    return ({ status: false, handle: undefined });
  }

  // If compare returns true, ie, both are the same
  if (compare === true) {
    // Query handle
    __query = `SELECT Handle FROM BLOGGING.Users WHERE Email='${__email}'`;
    try {
      // Get handle
      [result] = await mysql.connection.query(__query);
      // return ({ status: false, handle: handle })
    } catch (error) {
      console.log('MySQL querying for userHandle failed in auth');
      return ({ status: false, handle: undefined });
    }

    // Store handle
    const handle = result[0].Handle;
    // Return true
    return ({ status: true, handle });
  }

  // The passwords are not the same
  return ({ status: false, handle: undefined });
};

const generateAccessToken = async (__data) => {
  const JWT_SECRET="MY_JWT_KEY";
  const { status, handle } = await verifyUserCredentials(__data);
  if (status) {
    const token = jwt.sign({ handle }, `${JWT_SECRET}`, { expiresIn: '3d' });
    return { token, handle };
  }
  throw new Error('Please login with valid credentials!');
};

const verifyAccessToken = (__token) => {
  try {
    const decodedPayload = jwt.verify(__token, `${process.env.JWT_SECRET}`);
    return decodedPayload;
  } catch (error) {
    throw new Error(error.message);
  }
};

const Updatestatus = async (_token)=>{
   let status ="Active";
   let query = `UPDATE BLOGGING.Users Set Status='${status}'  where JWT='${_token}'`;
   //console.log(query);
   try{
    let result = await mysql.connection.query(query);
    console.log(result);
    if (result === undefined){
      return res.status(404).send({ message: "User Not found." });
    }
  }catch(error){
    return res.status(404).send({ message: "User Not found." });
  }
}
module.exports.Updatestatus =Updatestatus;
module.exports.generateAccessToken = generateAccessToken;
module.exports.verifyUserCredentials = verifyUserCredentials;
module.exports.verifyAccessToken = verifyAccessToken;
