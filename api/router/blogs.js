const express = require("express")
const router = express.Router()
const blogs = require("../model/blogs")
const except = { Image: 0, Description: 0 };
  
router.get("/get",async(req,res)=>{
    const data = await blogs.find({},except).limit(4)
})