import { useContext, useState,useEffect } from "react";
import "./write.css";
import axios from "axios";

//import { Dropdown, Selection } from 'react-dropdown-now';
//import 'react-dropdown-now/style.css';

import { Context } from "../../context/Context";


import React, { Component } from 'react'
import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]



export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [photo, setphoto]=useState("");
  const { user } = useContext(Context);
  const [categories,setcat]=useState("");
  const [cats, setCats] = useState([]);
  console.log(user[0].Handle);
   useEffect(() => {
  const fetchcat = async () => {
    const res = await axios.get("/categories");
    console.log(res.data);
    setCats(res.data);
    
  };
  
  fetchcat();
  }, []);
  
  console.log(cats);
  console.log(categories);
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    const newPost = {
      username: user.Name,
      title,
      desc,
      photo,
      handle: user[0].Handle,
      categories
    };
    if (file) {
      
      const data =new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      const res = await axios.post("/posts", newPost);
      console.log(res);
      window.location.replace("/");
    } catch (err) {}
  };
  return (
  
    <div className="write">
      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <select
                value={categories}
                onChange={(e) => {
                console.log("haris");
                setcat(e.target.value);
                }}>
              {cats.map((element)=>{
              return (
              <option key={element.ID}  value={element.ID}>{element.C_Name}  
               
              </option>
              )})}
             
              </select>   
              
          
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={e=>setTitle(e.target.value)}
          />
          
        </div>
        <div className="writeFormGroup">
          <textarea
            placeholder="Tell your story..."
            type="text"
            className="writeInput writeText"
            onChange={e=>setDesc(e.target.value)}
          ></textarea>
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
