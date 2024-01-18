const commentServices = require('../../services/comment-services')

const commentController = {
    postComment: (req, res, next) => {
        commentServices.postComment(req, (err, data) => err ? next(err) : res.redirect(`/restaurants/${data.restaurantId}`))
    },
    deleteComment: (req, res, next) => {
        commentServices.deleteComment(req, (err, data) => {
            if (err) next(err)
            req.flash('success_messages','已刪除評論')
            res.redirect(`/restaurants/${data.restaurantId}`)
        })
    },
}
module.exports = commentController