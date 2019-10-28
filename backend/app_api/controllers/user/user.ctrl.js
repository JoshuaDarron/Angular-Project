const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/user/User.model')


exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, )
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
      })

      user.save()
        .then(resUser => {
          res.status(201).json({
            message: 'User created successfully!',
            user: resUser
          })
        })
        .catch(err => {
          res.status(500).json({
              message: 'Invalid authentication credentials'
          })
        })
    })
}

exports.getUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(resUser => {
      if (!resUser) {
        return res.stats(404).json({
          message: 'User not found'
        })
      }

      fetchedUser = resUser

      return bcrypt.compare(req.body.password, resUser.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }

      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      },
      process.env.JWT_KEY,
      {
        expiresIn: '1h'
      })

      res.status(200).json({
        token,
        expiresIn: 3600,
        userId: fetchedUser._id
      })
    })
    .catch(err => res.status(401).json({
      message: 'Invalid authentication credentials'
    }))
}
