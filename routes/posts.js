const router = require("express").Router();
const bcrypt = require("bcrypt");
const req = require("express/lib/request");
const MYSQL_CONNECTOR = (require('../db/connectDB.js'));
const views= (require('../services/views.js'));

//CREATE POST
router.post("/", async (req, res) => {
  console.log(req.body);
    const salt = await bcrypt.genSalt(10);
   const hashedid  = await bcrypt.hash(req.body.title,salt);
  let sql = `INSERT INTO Blog(title,Users_Handle,Content,Blog_ID,Cattegory,Created_AT,Updated_AT) VALUES ('${req.body.title}','${req.body.handle}','${req.body.desc}','${hashedid}','${req.body.categories}',SYSDATE(),SYSDATE())`;
  let sql2= `INSERT INTO Photos(Blog_Blog_ID,Photo_ID) VALUES ('${hashedid}','${req.body.photo}')`;          
  try {
    const result = await MYSQL_CONNECTOR.connection.query(sql);
    const result2 = await MYSQL_CONNECTOR.connection.query(sql2);
    res.status(200).json({message:"Blog created Sucessfully"});
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}
router.put("/:id", async (req, res) => {
 
  
   let query=`Select * from BLOGGING.Blog WHERE title = '${req.params.id}'`;
   
      let result;
   
    try{
        [result] = await MYSQL_CONNECTOR.connection.query(query);
       if (isEmpty(result)){
         return res.status(400).json({message:"No Blog exist"});
       }
    }catch(err){
      return res.status(500).json({message:"No Blog exist"});
    }
  //console.log(req.body.handle);
  //console.log([result[0]][0].Users_Handle);
  try {
    if ([result[0]][0].Users_Handle === req.body.handle) {
      try {
        let sql = `UPDATE  Blog SET title='${req.body.title}',Content='${req.body.desc}',Cattegory=${req.body.categories},Updated_AT=SYSDATE() WHERE Blog_ID ='${[result[0]][0].Blog_ID}'`;  
        let sql2= `UPDATE Photos SET Photo_ID='${req.body.photo}' where Blog_Blog_ID='${[[result[0]][0].Blog_ID]}'`;        
        const result3 = await MYSQL_CONNECTOR.connection.query(sql);
        const result2 = await MYSQL_CONNECTOR.connection.query(sql2);
        
      } catch (err) {
       return  res.status(500).json(err);
      }
      let query2=`Select * from BLOGGING.Blog WHERE Blog_ID = '${[result[0]][0].Blog_ID}'`;
      try{
        let [result4] = await MYSQL_CONNECTOR.connection.query(query2);
        console.log(result4);
        return res.status(200).json(result4);
      }catch(err){
        return res.status(500).json(err);
      }

    } else {
      return res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  let query=`Select * from BLOGGING.Blog WHERE title = '${req.params.id}'`;
   
      let result;
   
    try{
        [result] = await MYSQL_CONNECTOR.connection.query(query);
       if (isEmpty(result)){
         return res.status(400).json({message:"No Blog exist"});
       }
    }catch(err){
      return res.status(500).json({message:"No Blog exist"});
    }
  try {
    
    if ([result[0]][0].Users_Handle === req.body.handle) {
      try {
        let sql = `Delete FROM Blog Where Blog_ID='${[result[0]][0].Blog_ID}'`;
        const result2 = await MYSQL_CONNECTOR.connection.query(sql);
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    let query=`Select * from BLOGGING.Blog WHERE title = '${req.params.id}'`;
    let [result]=await MYSQL_CONNECTOR.connection.query(query);
    
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      try {
        
        let query=`Select * from BLOGGING.Blog WHERE Users_Handle = (Select Handle FROM Users WHERE Name='${username}')`;
        let [result]=await MYSQL_CONNECTOR.connection.query(query);
        
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json(err);
      }
    } else if (catName) {
      try {
        let query=`Select * from BLOGGING.Blog WHERE Cattegory = ${catName}`;
        let [result]=await MYSQL_CONNECTOR.connection.query(query);
        
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      try {
        let query=`Select * from BLOGGING.Blog `;
        let [result]=await MYSQL_CONNECTOR.connection.query(query);
        
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
