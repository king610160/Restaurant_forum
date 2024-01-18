const express = require('express')
const router = express.Router()

const restController = require('../../controller/pages/rest-controller')
const userController = require('../../controller/pages/user-controller')
const commentController = require('../../controller/pages/comment-controller')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const {generalErrorHandler} = require('../../middleware/error-handling')
const passport = require('passport')

router.use('/admin', authenticatedAdmin, admin)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logOut)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) 
router.post('/comments', authenticated, commentController.postComment) 

router.get('/restaurants/feeds', authenticated, restController.getFeeds) 

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.get('/restaurants/:id', authenticated, restController.getRestaurant) 
router.get('/restaurants', authenticated, restController.getRestaurants) 

router.use('/', (req, res) => res.redirect('/restaurants')) //  若路由都行不通時，導到這個路由
router.use('/', generalErrorHandler)

module.exports = router