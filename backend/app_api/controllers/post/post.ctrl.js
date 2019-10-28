const Post = require('../../models/post/Post.model')


exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  })

  post.save()
    .then(resPost => {
      res.status(200).json({
        message: 'Post added successfully',
        post: {
          ...resPost,
          id: resPost._id,
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Creating a post failed'
      })
    })
}


exports.getAllPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize
  const currentPage = +req.query.page
  const postQuery = Post.find()
  let fetchedPosts

  if(pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }

  postQuery
    .then(resPost => {
      fetchedPosts = resPost
      return Post.countDocuments()
    })
    .then(count => res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: fetchedPosts,
      maxPosts: count
    }))
    .catch(err => {
      res.status(500).json({
        message: 'Fetching posts failed'
      })
    })
}


exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(resPost => {
      if (resPost) res.status(200).json(resPost)
      else res.status(404).json({ message: 'Post not found' })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching posts failed'
      })
    })
}


exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath

  if(req.file) {
    const url = req.protocol + '://' + req.get('host')
    imagePath = url + '/images/' + req.file.filename
  }

  const newPost = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  })

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, newPost)
    .then(resPost => {
      if (resPost.n > 0) res.status(200).json({ message: 'Update successful' })
      else res.status(401).json({ message: 'User not authorized to edit this post' })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Couldn\'t update post'
      })
    })
}


exports.deletePost = (req, res, next) => {
  const postId = req.params.id
  Post.deleteOne({
    _id: postId,
    creator: req.userData.userId
  }).then(resPost => {
      if (resPost.n > 0) res.status(200).json({ message: 'Deletion successful' })
      else res.status(401).json({ message: 'User not authorized to edit this post' })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching posts failed'
      })
    })
}

