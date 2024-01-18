'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'image', {
      type: Sequelize.STRING,
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Restaurants', 'image')
  }
}
