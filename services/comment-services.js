const { Comment, User, Restaurant } = require('../models')

const commentServices = {
    postComment: async (req, cb) => {
        try {
            const {text, restaurantId} = req.body
            const userId = req.user.id
            if (!text) throw new Error('請輸入相關評論')
            if (!restaurantId) throw new Error('無此餐廳')
            const [user, restaurant] = await Promise.all([
                User.findByPk(userId),
                Restaurant.findByPk(restaurantId)
            ])

            if (!user) throw new Error('無此使用者')
            if (!restaurant) throw new Error('無此餐廳')

            const result = await Comment.create({ text, restaurantId, userId })
            if (!result) throw new Error('評論上傳失敗')
            return cb(null, result)
        } catch(err) {
            return cb(err)
        }  
    },
    deleteComment: async (req, cb) => {
        try {
            const id = req.params.id
            console.log(id)
            if (!id) throw new Error('無此餐廳')
            const comment = await Comment.findByPk(id)
            const restaurantId = comment.restaurantId
            if (!comment) throw new Error('並無相關評論')
            await comment.destroy()

            
            return cb(null, { comment, restaurantId} )
        } catch(err) {
            return cb(err)
        }  
    },
}
module.exports = commentServices