const { Restaurant, User, Category } = require('../../models')
const adminServices = require('../../services/admin-services')
const { imgurFileHandler } = require('../../helper/file-helpers')

const adminController = {
    getRestaurants: (req, res, next) => {
        adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('admin/restaurants', {restaurants: data.restaurants, setting: data.setting}))
    },
    getRestaurant: (req, res, next) => {
        adminServices.getRestaurant(req, (err, data) => err ? next(err) : res.render('admin/detail-restaurant', {restaurant: data.restaurant}))
    },
    createRestaurant: async (req, res) => {
        const categories = await Category.findAll({ raw:true })
        return res.render('admin/create-restaurant', {categories})
    },
    addRestaurant: (req, res, next) => {
        adminController.addRestaurant(req, (err, data) => {
            if (err) return next(err)
            req.flash('success_messages', '已成功新增餐廳')
            req.session.deletedData = data // 把新增的資訊夾進去，前端可能會用到
            res.redirect('/admin/restaurants')
        })
    },
    editRestaurant: async (req, res, next) => {
        try {
            const restaurant = await Restaurant.findByPk(req.params.id,{
                raw:true
            })
            if (!restaurant) throw new Error('該餐廳不存在')
            const categories = await Category.findAll({ raw:true })
            categories.forEach(item => {
                if (restaurant.categoryId === item.id) item.selected = true
            })
            return res.render('admin/edit-restaurant', {restaurant, categories})
        } catch(err){
            next(err)
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
    deleteRestaurant: (req, res, next) => {
        adminServices.deleteRestaurant(req, (err, data) => {
            if (err) return next(err)
            req.flash('success_messages', '已成功刪除餐廳')
            req.session.deletedData = data // 把刪掉的資訊夾進去，前端可能會用到(例如已成功刪除XXX)
            res.redirect('/admin/restaurants')
        })  
    },
    getUsers: async(req, res, next) => {
        try {
            const users = await User.findAll({
                raw:true,
                nest:true,
            })
            const setting = {
                usersPage: true
            }
            return res.render('admin/users', {users, setting})
        } catch(err){
            next(err)
        }
    },
    deleteUsers: async function(req, res, next) {
        try {
            const userId = req.params.id
            const users = await User.findByPk(userId)
            if (!users) throw new Error('該餐廳不存在')
            await users.destroy()
            return adminController.getUsers(req, res, next)
        } catch(err){
            next(err)
        }
    },
}
module.exports = adminController