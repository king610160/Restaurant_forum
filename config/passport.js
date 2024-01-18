const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    // authenticate user
    async (req, email, password, cb, next) => {
        try {
            const user = await User.findOne({ 
                where: { email },
                attributes: { include: ['password'] } 
            })
            if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))       
            const compare = await bcrypt.compare(password, user.password)
            if (!compare) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return cb(null, user)
        } catch(err) {
            next(err)
        }
    }
))

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
    try {
        const user = await User.findByPk(jwtPayload.id, {
            include: [
              { model: Restaurant, as: 'FavoritedRestaurants' },
              { model: User, as: 'Followers' },
              { model: User, as: 'Followings' }
            ]
        })

        // 如果找不到使用者，可能是 Token 不合法，也可以根據需求處理其他邏輯
        if (!user) return cb(null, false)

        // 這裡可以進一步檢查 token 是否過期, exp是秒，Date.now()是毫秒，所以要把Date.now()給除1000
        const currentTime = Math.floor(Date.now() / 1000)
        if (currentTime > jwtPayload.exp) {
            return cb(null, false, { message: 'Token has expired' })
        }

        return cb(null, user)
    } catch(err) {
        return cb(err)
    }
}))

  // serialize and deserialize user
passport.serializeUser((user, cb) => {
    cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
    let user = await User.findByPk(id, {
        include: [
            { model: Restaurant, as: 'FavoritedRestaurants' },
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
        ]
    })
    user = user.toJSON()
    return cb(null, user)
})

module.exports = passport