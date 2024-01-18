const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const { apiErrorHandler } = require('../../middleware/error-handling')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

const restController = require('../../controller/apis/rest-controller')
const userController = require('../../controller/apis/user-controller')
const commentController = require('../../controller/apis/comment-controller')
const admin = require('./modules/admin')

// admin
router.use('/admin', authenticated, authenticatedAdmin, admin)

// top-user
router.get('/users/top', authenticated, userController.getTopUsers)

// comment
router.delete('/comments/:id', authenticated, authenticatedAdmin, commentController.deleteComment) 
router.post('/comments', authenticated, commentController.postComment) 

// feed
router.get('/restaurants/feeds', authenticated, restController.getFeeds) 

// following
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// restaurants
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

// signin, signup
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

// error handle's routes
router.use('/', apiErrorHandler)

module.exports = router
