const { Restaurant, Category } = require('../models')
const { imgurFileHandler } = require('../helper/file-helpers')

const adminServices = {
    getRestaurants: async (req, cb) => {
        try {
            const restaurants = await Restaurant.findAll({
                raw:true,
                nest:true,
                include: [Category]
            })
            const setting = {
                restaurantsPage:true
            }
            return cb(null, {restaurants, setting})
        } catch(err){
            return cb(err)
        }
    },
    getRestaurant: async (req, cb) => {
        try {
            const restaurant = await Restaurant.findByPk(req.params.id,{
                raw:true,
                nest:true,
                include: [Category]
            })
            if (!restaurant) throw new Error('該餐廳不存在')
            return cb(null, {restaurant})
        } catch(err){
            return cb(err)
        }
    },
    addRestaurant: async (req, cb) => {
        try {
            const {name, tel, address, description, openingHours, categoryId } = req.body
            if (!name || !tel || !address || !description || !openingHours) {
                const restaurant = req.body
                const error_messages = '請填入所有欄位'
                return cb(null, {restaurant, error_messages})
            }
            const { file } = req
            const image = await imgurFileHandler(file)
            const restaurant = await Restaurant.create({
                name,
                tel,
                address,
                description,
                openingHours,
                categoryId,
                image: image || null
            })
            return cb(null, { restaurant: restaurant })
        } catch(err) {
            return cb(err)
        }
    },
    putRestaurant: async (req, cb) => {
        try {
            const {name, tel, address, description, openingHours, categoryId } = req.body
            const restaurantId = req.params.id
            if (!name || !tel || !address || !description || !openingHours) {
                const restaurant = req.body
                const error_messages = '請填入所有欄位'
                return cb(null, {restaurant, error_messages})
            }
            const restaurant = await Restaurant.findByPk(restaurantId)
            if (!restaurant) throw new Error('該餐廳不存在')
            const { file } = req
            const image = await imgurFileHandler(file)
            await restaurant.update({
                name,
                tel,
                address,
                description,
                openingHours,
                categoryId,
                image: image || restaurant.image
            })
            return cb(null, { restaurant: restaurant })
        } catch(err) {
            return cb(err)
        }
    },
    deleteRestaurant: async (req, cb) => {
        try {
            const restaurantId = req.params.id
            const restaurant = await Restaurant.findByPk(restaurantId)
            if (!restaurant) {
                const err = new Error('該餐廳不存在')
                err.status = 404
                throw err
            }
            await restaurant.destroy()
            return cb(null, { restaurant: restaurant })
        } catch(err) {
            return cb(err)
        }
    },
}

module.exports = adminServices