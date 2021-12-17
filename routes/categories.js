const MYSQL_CONNECTOR = (require('../db/connectDB.js'));
const router = require("express").Router();


//CREATE CAT
router.post("/", async (req, res) => {
 
 
    let sql = `INSERT INTO Cattegory(Name) Values ('${req.body.name}')`;              
    try {
      const result = await MYSQL_CONNECTOR.connection.query(sql);   
      res.status(200).json({message:"Cattegory created Sucessfully"});
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get by id
  
router.get("/:id", async (req, res) => {
    try {
      let query=`Select * from BLOGGING.Cattegory Where ID=${req.params.id}`;
      let [result]=await MYSQL_CONNECTOR.connection.query(query);
      
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  //GET all
  router.get("/", async (req, res) => {
    try {
      let query=`Select * from BLOGGING.Cattegory `;
      let [result]=await MYSQL_CONNECTOR.connection.query(query);
      
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  });




module.exports = router;
