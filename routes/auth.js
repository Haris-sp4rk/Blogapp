const nodemailer = (require('../config/nodemailer.config.js'));
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const MYSQL_CONNECTOR = (require('../db/connectDB.js'));
const bcrypt = require("bcrypt");
const verify= (require('../services/auth.js'));

//REGISTER 
router.post("/register",async (req,res)=>{
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedpass  = await bcrypt.hash(req.body.password,salt);
    const hashhandle = await bcrypt.hash(req.body.email,salt);
   
    try{
        //checking if email already exists
            let __query = `SELECT Password FROM BLOGGING.Users WHERE Email='${req.body.email}'`;
            let result;
            try {
                [result] = await MYSQL_CONNECTOR.connection.query(__query);
                 
                // If  email exsist, throw an error
                if ([result[0]][0] !== undefined){ 
                  console.log("already exists");
                  throw new Error(' email already exists.');}
                  else{ //else register

                    try {
                      req.body.handle=hashhandle;
                      const JWT_SECRET="MY_JWT_KEY";
                      const token = jwt.sign({ hashhandle }, `${JWT_SECRET}`, { expiresIn: '3d' });
                      console.log(token);
                      let sql = `INSERT INTO Users(Handle,Name,Email, Password,Start_Date,JWT) VALUES ('${hashhandle}','${req.body.username}','${req.body.email}','${hashedpass}',SYSDATE(),'${token}')`;
                      let  result = await MYSQL_CONNECTOR.connection.query(sql);
                      console.log('Registered Successfully Please Check Your Email');
                      console.log(result);
                      nodemailer.sendConfirmationEmail(
                        req.body.username,
                        req.body.email,
                        token
                 );

          
          
                      let __query2 = `SELECT * FROM BLOGGING.Users WHERE Email='${req.body.email}'`;
                      
                      let user= await MYSQL_CONNECTOR.connection.query(__query2);
                      
                     
                      res.status(200).json(user);
                    } catch (error) {
                      console.log(`Error occured --> ${error.message}`);
                    }
                  }
            } catch (error) {
                console.log(`Error occured --> ${error.message}`);
                res.error(error.message);
            }
        
        
        

    }catch(err){
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async (req, res) => {
 
    try {
        
        const { status, handle } = await verify.verifyUserCredentials(req.body);
        if (status) {
          
          }else{
          res.status(500).error("Wrong Credentials");
          }
      // response ma sara data jaiga
      let __query2 = `SELECT * FROM BLOGGING.Users WHERE Email='${req.body.email}'`;          
      let [user]= await MYSQL_CONNECTOR.connection.query(__query2);
      console.log(user[0].Status);
      if (user[0].Status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }else{
        res.status(200).json(user);
      }
         
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //UPDATING JWT
  router.get("/confirm/:confirmationCode", async (req,res) => {

    const confirmationcode = req.params.confirmationCode;
    console.log(confirmationcode);
     verify.Updatestatus(confirmationcode);
     res.status(200).send({message:"Now u can login!"});
    
  })
module.exports=router;
