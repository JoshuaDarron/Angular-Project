const express = require('express')

const router = express.Router()

// CONTROLLERS
const postsCtrl = require('../../controllers/post/post.ctrl')
// MIDDLEWARE
const checkAuth = require('../../middleware/check-auth.mdwr')
const extractFile = require('../../middleware/file.mdwr')


router.post('/', checkAuth, extractFile, postsCtrl.createPost)
router.get('/', postsCtrl.getAllPosts)
router.get('/:id', postsCtrl.getOnePost)
router.put('/:id', checkAuth, extractFile, postsCtrl.updatePost)
router.delete('/:id', checkAuth, postsCtrl.deletePost)


module.exports = router
