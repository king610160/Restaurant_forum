const express = require('express')
const router = express.Router()
const upload = require('../../../middleware/multer') 

const adminController = require('../../../controller/pages/admin-controller')
const categoryController = require('../../../controller/pages/category-controller')

// admin
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)

// user
router.delete('/users/:id', adminController.deleteUsers)
router.get('/users', adminController.getUsers)


// category
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
router.get('/categories/:id/edit', categoryController.editCategory)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

router.post('/restaurants', upload.single('image'), adminController.addRestaurant)


router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router