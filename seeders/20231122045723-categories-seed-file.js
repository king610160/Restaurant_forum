'use strict'

module.exports = {
  up: async (queryInterface) => {
    let arr = ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
    arr = arr.map(i => {
      return {
        name: i,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
    await queryInterface.bulkInsert('Categories', arr)
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Categories', {})
  }
}
