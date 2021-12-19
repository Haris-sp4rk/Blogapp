const router = require("express").Router();
//const User = require("../models/User");
//const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const MYSQL_CONNECTOR = (require('../db/connectDB.js'));

//UPDATE
router.put("/:id", async (req, res) => {
  //console.log(req.params.id);
  //console.log(req.body);
  console.log(req.body);
  if (req.body.email === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      
    try {
      //yahan pr db ma update krwana ha
      let __query = `UPDATE BLOGGING.Users SET Profile_Picture='${req.body.Profile_Pic}',Name='${req.body.username}', Password='${req.body.password}', Email='${req.body.email}'  WHERE Email='${req.body.email}'`;
      [result] = await MYSQL_CONNECTOR.connection.query(__query);
          //console.log(result);
      let __query2 = `SELECT * FROM BLOGGING.Users WHERE Email='${req.body.email}'`;
      [result2] = await MYSQL_CONNECTOR.connection.query(__query2);
      //console.log(result2);
      res.status(200).json(result2);
    } catch (err) {
      res.status(500).json(err);
    }
    }else{
      
    try {
      //yahan pr db ma update krwana ha
      let __query = `UPDATE BLOGGING.Users SET Profile_Picture='${req.body.Profile_Pic}',Name='${req.body.username}', Email='${req.body.email}'  WHERE Email='${req.body.email}'`;
      [result] = await MYSQL_CONNECTOR.connection.query(__query);
          //console.log(result);
      let __query2 = `SELECT * FROM BLOGGING.Users WHERE Email='${req.body.email}'`;
      [result2] = await MYSQL_CONNECTOR.connection.query(__query2);
      //console.log(result2);
      res.status(200).json(result2);
    } catch (err) {
      res.status(500).json(err);
    }
    }
    
  
  
  } else {
    res.status(401).json("You can update only your account!");
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  if (req.body.email === req.params.id) {
    try {
      let __query = `DELETE  FROM BLOGGING.Users WHERE Email='${req.body.email}'`;
      let __query2 = `DELETE  FROM BLOGGING.Blog WHERE Users_Handle='${req.body.handle}'`;
      let result;
      
      try {
        [result] = await MYSQL_CONNECTOR.connection.query(__query);
        [result] = await MYSQL_CONNECTOR.connection.query(__query2);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found!");
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
});

//GET USER
router.get("/:id", async (req, res) => {
 
  try {
    let __query = `SELECT * FROM BLOGGING.Users WHERE Handle='${req.body.handle}'`;
    let result;
    try {
      [result] = await MYSQL_CONNECTOR.connection.query(__query);
  
      // If no such id, throw an error
      if ([result[0]][0] === undefined) throw new Error('No such id exists.');
    } catch (error) {
      return ({ status: false, handle: undefined });
    }
    
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
