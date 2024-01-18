const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helper/pagination-helper')
const restaurantServices = {
  getRestaurants: async (req, cb) => {
    try {
        const categoryId = Number(req.query.categoryId) || ''
        let noSearch_messages = ''
        const DEFAULT_LIMIT = 9 // 默認render一頁數量
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || DEFAULT_LIMIT
        const offset = getOffset(limit, page)
        let [restaurants, categories] = await Promise.all([
          Restaurant.findAndCountAll({ // 會有個count算出總數，及rows含各種資料
            include: Category,
            where :{
              ...categoryId ? {categoryId} : {} // categoriesId是個物件，要先解構看裡面有沒有東西
            },
            limit,
            offset,
            nest: true,
            raw: true
          }),
          Category.findAll({
            raw : true
          })
        ])
        if (!restaurants.count) {
          noSearch_messages = '目前還沒有任何該類別餐廳的資料喔！'
        }
        let FavoritedRestaurants = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        FavoritedRestaurants = new Set(FavoritedRestaurants)
        const data = restaurants.rows.map(r => ({
            ...r,
            description: r.description.substring(0, 50),
            isFavorited: FavoritedRestaurants.has(r.id)
        }))
        return cb(null, {
          restaurants: data, 
          categories, 
          categoryId, 
          noSearch_messages,
          pagination: getPagination(limit, page, restaurants.count)
        })
    } catch(err) {
        return cb(err)
    }

  },
  getRestaurant: async (req, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [ 
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' }
        ],
      })
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      return cb(null, {restaurant: restaurant.toJSON(), isFavorited})
    } catch(err) {
      return cb(err)
    }
  },
  getFeeds: async (req, cb) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          order:[['createdAt', 'desc']],
          limit: 10,
          include:[Category],
          raw: true,
          nest: true
        }),
        Comment.findAll({
          order:[['createdAt', 'desc']],
          limit: 10,
          include:[User,Restaurant],
          raw: true,
          nest: true
        })
      ])
      return cb(null, {restaurants, comments})
    } catch(err) {
      return cb(err)
    }
  }
}

module.exports = restaurantServices