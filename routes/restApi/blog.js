const express = require('express')
const { handleGetBlogs, handleCreateBlogs, handleUpdateBlogs, handleDeleteBlogs, handleGetBlog } = require('../../controllers/blogController')
const router = express.Router()

router.route('/')
    .get(handleGetBlogs)
    .post(handleCreateBlogs)
    .patch(handleUpdateBlogs);
 

router.delete('/:id', handleDeleteBlogs)
router.get('/:id', handleGetBlog)

module.exports = router