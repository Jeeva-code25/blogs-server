const asyncHandler = require('express-async-handler')
const blogModel = require('../model/blogModel')
const userModel = require('../model/userModel')

const handleGetBlogs = asyncHandler( async (req, res) => {
    const blogs = await blogModel.find()
    if(!blogs || blogs?.length <= 0) return res.status(204).json({"message": "Blogs not found"}); 

    res.status(201).json(blogs)
})


const handleCreateBlogs = asyncHandler( async (req, res) => {   
     
    const {userId, title, description} = req.body

    if (!userId || !title || !description) return res.status(400).json({"message": "All fields are required"}) // 400 means bad request
    
    const user = await userModel.findOne({_id: userId}).exec()


    if(!user) return res.status(204).json({"message": "User not found"}); 

    try {
        
        const newPost = {
            title,
            description,
            userId
        }

        const result = await blogModel.create(newPost)
        user.posts.push({"postId": result.id})
        const userResult = await user.save()

        console.log(`${result}\n${userResult}`);
        
        res.status(201).json(result)

    } catch (err) {
        res.status(500).json({"error": err.message})
    }
})


const handleUpdateBlogs = asyncHandler( async (req, res) => {

    const {userId, id, title, description, like, comment} = req?.body
    
    if(!userId || !id || !title || !description || like < 0 || !comment) return res.status(400).json({'message': "All fields are required!!"});

    
    const blog = await blogModel.findOne({"_id": req.body.id}).exec()

    if(!blog) return res.status(204).json({'message': `No blog found ${req.body.id}`});

    try {
       
        blog.title = title
        blog.description = description
        blog.like = like
        const filterCmt = blog.comments.filter(cmt => {cmt.userId !== userId})
        
        filterCmt.push({userId, "message":comment})
        blog.comments = filterCmt

        const result = await blog.save()
        console.log(result)
        res.status(201).json(result)

    } catch (error) {
        console.error(error);
    }

})


const handleDeleteBlogs = asyncHandler(async (req, res) => {

    const id = req?.params?.id
    if(!id) return res.status(400).json({'message': "id  parameter missing!!"});

    console.log(id);
    

    const foundBlog = await blogModel.findOne({"_id": id}).exec()

    if(!foundBlog) return res.status(204).json({'message': `No blog found ${id}`});
    

    try {
        const result = await foundBlog.deleteOne()
        console.log(result);
        res.status(201).json(id)
        
    } catch (error) {
        console.error(error);
    }
})
const handleGetBlog = asyncHandler( async (req, res) => {

    if(!req?.params?.id) return res.status(400).json({'message': "id  parameter missing!!"});

    const foundBlog = await blogModel.findOne({"_id": req.body.id}).exec()

    if(!foundBlog) return res.status(204).json({'message': `No blog found ${req.body.id}`});

    res.status(201).json(foundBlog)
})

module.exports = {
    handleGetBlogs,
    handleCreateBlogs,
    handleUpdateBlogs,
    handleDeleteBlogs,
    handleGetBlog
}