// MONGO ATLAS PW: 7LOdssguSceNdLyd
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

const userRoutes = require('./app_api/routes/user/user.routes')
const postRoutes = require('./app_api/routes/post/post.routes')

// CONSOLE COLORS
const reset = '\x1b[0m'
const green = '\x1b[32m'


mongoose.connect('mongodb+srv://joshua:' + process.env.MONGO_ATLAS_PW + '@cluster0-rtnan.mongodb.net/ang-proj?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => console.log(green + "[mongoose] successfully connected" + reset))
  .catch(err => console.error(err))


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/images', express.static(path.join('images')))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  )
  next()
})


app.use('/api/user', userRoutes)
app.use('/api/posts', postRoutes)


module.exports = app
