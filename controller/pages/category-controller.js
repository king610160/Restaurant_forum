const { Category } = require('../../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
        const categories = await Category.findAll({raw: true})
        const setting = {
          categoriesPage : true,
          action : 'CREATE',
          buttonStyle : 'btn btn-success',
          href : '/admin/categories'
        }
        res.render('admin/categories', { categories, setting })
    } catch(err) {
        next(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
        let { name } = req.body
        name = name.trim()
        if (!name) throw new Error('請輸入相關類別')
        await Category.create({ name })
        req.flash('success_messages','已成功新增類別')
        res.redirect('/admin/categories')
    } catch(err) {
        next(err)
    }
  },
  editCategory: async (req, res, next) => {
    try {
        const id = req.params.id
        const target = await Category.findByPk(id, { raw:true })
        const categories = await Category.findAll({ raw:true })
        const setting = {
          page : true,
          action : 'UPDATE',
          buttonStyle : 'btn btn-warning',
          href : `/admin/categories/${id}?_method=PUT`,
          description : target.name
        }
        res.render('admin/categories', { categories, setting })
    } catch(err) {
        next(err)
    }
  },
  putCategory: async (req, res, next) => {
    try {
        let { name } = req.body
        if (!name) throw new Error('請輸入相關類別')
        const target = await Category.findOne({ name })
        if (!target) throw new Error('資料庫中無此類別')
        await target.update({ name })

        req.flash('success_messages','已成功修改類別')
        res.redirect('/admin/categories')
    } catch(err) {
        next(err)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      let id = req.params.id
      console.log(id)
      const target = await Category.findByPk(id)
      if (!target) throw new Error('資料庫中無此類別')
      await target.destroy()

      req.flash('success_messages','已成功刪除該類別')
      res.redirect('/admin/categories')
    } catch(err) {
        next(err)
    }
  },
}
module.exports = categoryController