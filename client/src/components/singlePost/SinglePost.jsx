import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./singlePost.css";

export default function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const PF = "http://localhost:5000/images/";
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [temp, setTemp] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
 
  useEffect(() => {
    const getPost = async () => {
      
      const res = await axios.get("/posts/" + path);
      
      setPost(res.data[0]);
      setTemp(res.data[0].title);
      setTitle(res.data[0].title);
      setDesc(res.data[0].Content);
      console.log(res);
    };
    getPost();
  }, [path]);

 console.log(post);
 console.log(path);
 console.log(user);
  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post.title}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (err) {}
  };
  

  const handleUpdate = async () => {
    console.log(title);
    try {
      await axios.put(`/posts/${temp}`,post
      // {
      //   username: user.username,
      //   title,
      //   desc,
      // }
      );
      setTitle(post.title);
      setUpdateMode(false)
    } catch (err) {}
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
          <img src={PF + post.photo} alt="" className="singlePostImg" />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => {
              //setTemp(title);
              setTitle(e.target.value);
              post.title=e.target.value;}}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.Users_Handle === user[0].Handle && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to={`/?user=${post.Name}`} className="link">
              <b> {post.Name}</b>
            </Link>
          </span>
          <span className="singlePostViews">
            Views:
            <Link to={`/?user=${post.Name}`} className="link">
              <b> {post.Views}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.Created_AT).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={post.Content}
            onChange={(e) =>{ 
              post.Content=e.target.value;
              setDesc(e.target.value)}}
          />
        ) : (
          <p className="singlePostDesc">{post.Content}</p>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
    </div>
  );
}
