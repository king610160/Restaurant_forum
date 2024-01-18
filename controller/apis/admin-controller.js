const adminServices = require('../../services/admin-services')

const adminController = {
    getRestaurants: (req, res, next) => {
        adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    getRestaurant: (req, res, next) => {
        adminServices.getRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    addRestaurant: (req, res, next) => {
        adminServices.addRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
    },
    deleteRestaurant: (req, res, next) => {
        adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))  
        // res.json({ status: 'success', data })
    },
}

module.exports = adminController