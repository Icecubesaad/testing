const express = require("express")
const router = express.Router()
const BlogsModel = require("../Model/Blogs")
const middleware = require("../Middleware/Middleware")
const { v4: uuidv4 } = require('uuid');
router.post("/Post",middleware,async(req,res)=>{
    const Time = new Date();
    const {title,description,tags,user,field,image} = req.body;
    const Saving  = await BlogsModel.create({
        Title:title,
        Description:description,
        Tags:tags,
        Date:[{
            date:Time.getDate(),
            month:Time.getMonth(),
            year:Time.getFullYear()
        }
        ],
        User:user,
        Likes:0,
        Id:uuidv4(),
        Type:field,
        Image:image
    })
    res.send(Saving)
})
router.get("/get/:id/:page", async (req, res) => {
    const page = parseInt(req.params.page);
    const skip = (page - 1) * 4;
    const id = req.params.id;
    const except = { Image: 0, Description: 0 };
  
    if (id === "undefined") {
      const blogs = await BlogsModel.find({}, except)
        .skip(skip)
        .limit(4);
      res.send(blogs);
    } else {
      const blogs = await BlogsModel.find({ Type: id }, except)
        .skip(skip)
        .limit(4);
      res.send(blogs);
    }
  });
  
  
router.get("/filter/:id",async(req,res)=>{
    const id = req.params.id;
    const except = {Image:0}
    const data = await BlogsModel.findOne({Id:id},except).limit(1)
    res.send(data)
})
router.get("/filterImage/:id",async(req,res)=>{
    const id = req.params.id;
    const except = {Title:0,Likes:0,Date:0,User:0,Description:0,Tags:0,Type:0}
    const data = await BlogsModel.findOne({Id:id},except).limit(1)
    res.send(data)
})
router.get("/Relate/:id",async(req,res)=>{
    const except = {Description:0,Image:0}
    const id = req.params.id;
    const data = await BlogsModel.findOne({Id:id},except)
    const query = { Tags: { $in: data.Tags } };
const RelatableData =await BlogsModel.find(query,except);
    res.send(RelatableData)
})
router.post("/updates/:id",async(req,res)=>{
    const {changelike} = req.body;
    if(changelike){
        const id = req.params.id;
        const update = { $inc: { Likes: 1 } };
        const filter = {Id:id}
        const options = {new:true}
        const data =await BlogsModel.findOneAndUpdate(filter,update,options)
    }
    if(!changelike){
        const id = req.params.id;
        const update = { $inc: { Likes: -1 } };
        const filter = {Id:id}
        const options = {new:true}
        const data =await BlogsModel.findOneAndUpdate(filter,update,options)
    }
})
router.get("/hot",async(req,res)=>{
    const date = new Date();
    const except = {Description:0,Image:0}
    const data = await BlogsModel.find({},except);
    let mostLiked = {
        Likes : 0,
        month:0,
    };
    let HotPosts = [];
    let secondLiked = {
        Likes : 0,
        month:0,
    };;
    let ThirdLiked = {
        Likes : 0,
        month:0,
    };
    data.map((e)=>{
        if(e.Likes >= mostLiked.Likes){
            mostLiked = e;
        }
    })
    data.map((e)=>{
        if(e.Likes >= secondLiked.Likes && secondLiked.Likes<mostLiked.Likes && e.Likes != mostLiked.Likes){
            if(secondLiked.Likes === 0 && mostLiked.Likes ===0){
                secondLiked.Likes = e;
            }
            else{
                secondLiked = e;
            }
        }
    })
    data.map((e)=>{
        if(e.Likes >= ThirdLiked.Likes && ThirdLiked.Likes < secondLiked.Likes && e.Likes != mostLiked.Likes &&  e.Likes != secondLiked.Likes){
            if(ThirdLiked.Likes === 0 && secondLiked.Likes ===0 && mostLiked.Likes === 0){
                ThirdLiked=e;
            } 
            else{

                ThirdLiked = e;
            }
        }
    })
    if(mostLiked.Date.some(e=>e.month === date.getMonth())){
        HotPosts.push(mostLiked)
    }
    if(secondLiked.Date.some((e)=>e.month === date.getMonth())){

        HotPosts.push(secondLiked)
    }
    if(ThirdLiked.Date.some((e)=>e.month === date.getMonth())){

        HotPosts.push(ThirdLiked)
    }
    res.json(HotPosts)
})
module.exports = router

