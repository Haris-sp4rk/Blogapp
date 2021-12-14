const express = require("express");
const app = express();
const cors = require('cors');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");


//storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

//uploading image
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

const sqlScripts = require('./db//sqlscript');
const req = require("express/lib/request");
app.use(express.json());
//app.use(cors);
// app.use("/",(req,res)=>{
//     console.log("hey");
// })
sqlScripts.createAndInsert();
//middleware
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/categories",categoryRoute);

app.listen("5000", () => {
    console.log("Backend is running.");
  });