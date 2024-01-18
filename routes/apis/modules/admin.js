const express = require('express')
const router = express.Router()
const upload = require('../../../middleware/multer') 

const adminController = require('../../../controller/apis/admin-controller')

router.get('/restaurants/:id', adminController.getRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.post('/restaurants', upload.single('image'), adminController.addRestaurant)

router.get('/restaurants', adminController.getRestaurants)

module.exports = router