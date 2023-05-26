const express = require("express")
const router = express.Router()
const blogs = require("../model/blogs")

router.get("/get",async(req,res)=>{
    const except = { Image: 0, Description: 0 };
    const data = await blogs.find({},except).limit(4)
    res.send(data)
})