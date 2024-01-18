const { User, Restaurant, Favorite, Followship } = require('../models')
const bcrypt = require('bcryptjs')

const userServices = {
    signUp: async (req, cb) => {
        try {
            const {name, email, password, passwordCheck} = req.body
            if (password !== passwordCheck) throw new Error('2次密碼不相符!')

            const result = await User.findOne( {where: {email : email} } )
            if (result) throw new Error('用戶已存在!')
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            const user = await User.create({
                name: name,
                email: email,
                password: hashPassword
            })
            return cb(null, {user})
        } catch(err) {
            return cb(err)
        }
    },
    addFavorite: async(req, cb) => {
        const message = []
        try {
            const { restaurantId } = req.params
            const userId = req.user.id
            // 驗證，有才加
            const [restaurant, favorite] = await Promise.all([
                Restaurant.findByPk(restaurantId),
                Favorite.findOne({
                    where: {
                      userId: userId,
                      restaurantId: restaurantId
                    }
                })
            ])
            if (!restaurant) message.push('無此餐廳資訊')
            if (favorite) message.push('已收藏此餐廳')

            if (message.length) throw new Error()
            // 加進去
            const newFavorite = await Favorite.create({
                restaurantId,
                userId
            })
            return cb(null, { newFavorite })
          } catch(err) {
            return cb(err, { err : message })
        }
    },
    removeFavorite: async(req, cb) => {
        try {
            const { restaurantId } = req.params
            const userId = req.user.id
            const [restaurant, favorite] = await Promise.all([
                Restaurant.findByPk(restaurantId),
                Favorite.findOne({
                    where: { 
                      userId,
                      restaurantId
                    },
                })
            ])
            if (!restaurant) throw new Error('無此餐廳資訊')
            if (!favorite) throw new Error('並未收藏此餐廳')
            
            await favorite.destroy()

            return cb(null, favorite)
          } catch(err) {
            return cb(err)
        }
    },
    getTopUsers: async (req, cb) => {
        try {
            let users = await User.findAll({
                include:[{ model:User, as:'Followers' }]
            })
            users = users.map(user => ({
                ...user.toJSON(),
                image:`https://loremflickr.com/320/240/girl,headshots/?random=${Math.random() * 100}`,
                followerCount: user.Followers.length,
                isFollowed: req.user.Followings.some(f => f.id === user.id)
            }))
            users = users.sort((a, b) => b.followerCount - a.followerCount)
            return cb(null, { users })
          } catch(err) {
            return cb(err)
        }
    },
    addFollowing: async (req, cb) => {
        try {
            const { userId } = req.params
            let [user, followship] = await Promise.all([
              User.findByPk(userId),
              Followship.findOne({
                where: {
                  followerId: req.user.id,
                  followingId: req.params.userId
                }
              })
            ])
    
            if (!user) throw new Error('使用者不存在')
            if (followship) throw new Error('你已追蹤該使用者')
            const addFollow = await Followship.create({
                followerId: req.user.id,
                followingId: userId
            })
            return cb(null, addFollow)
        } catch(err) {
            return cb(err)
        }
    },
    removeFollowing: async(req, cb) => {
        try {
            const followship = await Followship.findOne({
                where: {
                    followerId: req.user.id,
                    followingId: req.params.userId
                }
            })
            if (!followship) throw new Error('你還未追蹤該使用者')
            await followship.destroy()
            return cb(null, followship)
        }catch(err){
            return cb(err)
        }
    }
}

module.exports = userServices