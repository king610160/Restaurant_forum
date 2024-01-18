// const bcrypt = require('bcryptjs')
// const { User, Followship } = require('../../models')
const userServices = require('../../services/user-services')

const userController = {
    signUpPage: (req, res) => {
        res.render('signup')
    },
    signUp: (req, res, next) => {
        userServices.signUp(req, (err, data) => {
            if(err) next(err)
            req.flash('success_messages', '成功註冊帳號')
            req.session.singUpData = data
            res.redirect('/signin')
        })
    },
    signInPage: (req, res) => {
        res.render('signin')
    },
    signIn: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/restaurants')
    },
    logOut: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/signin')
    },
    addFavorite: (req, res, next) => {
        userServices.addFavorite(req, (err) => err ? next(err) : res.redirect('back'))
    },
    removeFavorite: (req, res, next) => {
        userServices.removeFavorite(req, (err) => err ? next(err) : res.redirect('back'))
    },
    getTopUsers: (req, res, next) => {
        userServices.getTopUsers(req, (err, data) => err ? next(err) : res.render('top-users', { users : data.users }))
    },
    addFollowing: (req, res, next) => {
        userServices.addFollowing(req, (err) => err ? next(err) : res.redirect('back'))
    },
    removeFollowing: async(req, res, next) => {
        userServices.removeFollowing(req, (err) => err ? next(err) : res.redirect('back'))
    }
}
module.exports = userController