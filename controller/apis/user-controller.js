const jwt = require('jsonwebtoken')
const userServices = require('../../services/user-services')

const userController = {
    signIn: (req, res, next) => {
        try {
            const userData = req.user.toJSON()
            delete userData.password
            const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
            res.json({
                status: 'success',
                data: {
                  token,
                  user: userData
                }
            })
        } catch(err) {
            next(err)
        }
    },
    signUp: (req, res, next) => {
        userServices.signUp(req, (err, data) => {
            if (err) next(err)
            delete data.user.dataValues.password
            res.json({
                status: 'success',
                data: data
            })
        })
    },
    addFavorite: (req, res, next) => {
        userServices.addFavorite(req, (err, data) => {
            if (err) next(err)
            res.json({status: 'success', data})
        })
    },
    removeFavorite: (req, res, next) => {
        userServices.removeFavorite(req, (err, data) => {
            if (err) next(err)
            res.json({status: 'success', data})
        })
    },
    getTopUsers: (req, res, next) => {
        userServices.getTopUsers(req, (err, data) => err ? next(err) : res.json({status: 'success', data}))
    },
    addFollowing: (req, res, next) => {
       userServices.addFollowing(req, (err, data) => err ? next(err) : res.json({status: 'success', data}))
    },
    removeFollowing: (req, res, next) => {
        userServices.removeFollowing(req, (err, data) => err ? next(err) : res.json({status: 'success', data}))
    }
}

module.exports = userController