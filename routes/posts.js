const router = require("express").Router();


//CREATE POST
router.post("/", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
   const hashedid  = await bcrypt.hash(req.body.title,salt);
  const newpost=new Post({
      title:req.body.title,
      content:req.body.desc,
      photo:req.body.photo,
      categories:req.body.categories,
      ID:hashedid,
      username:req.body.username
  })
  let sql = `INSERT INTO Blog(title,Users_Handle,Content,Blog_ID,Cattegory) VALUES (${newpost.title},${newpost.username},${newpost.content},${newpost.ID},${newpost.categories})`;
  let sql2= `INSERT INTO Photos(Blog_Blog_ID,Photo_ID) VALUES (${newpost.ID},${newpost.photo})`;          
  try {
    const result = await MYSQL_CONNECTOR.connection.query(sql);
    const result2 = await MYSQL_CONNECTOR.connection.query(sql2);
    res.status(200).json(newpost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
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
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
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
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
