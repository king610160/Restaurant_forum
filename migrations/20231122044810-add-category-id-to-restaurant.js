'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull:false,
      reference:{
        model:'Categories',
        key:'id'
      }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Restaurants', 'category_id')
  }
}
