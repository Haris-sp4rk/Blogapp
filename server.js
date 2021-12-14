const express = require("express");
const app = express();
const cors = require('cors');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");


const sqlScripts = require('./db//sqlscript');
app.use(express.json());
//app.use(cors);
// app.use("/",(req,res)=>{
//     console.log("hey");
// })
sqlScripts.createAndInsert();
//middleware
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
  

app.listen("5000", () => {
    console.log("Backend is running.");
  });