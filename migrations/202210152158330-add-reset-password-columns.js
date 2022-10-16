'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.addColumn('users', 'reset_password_token', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction }),
        queryInterface.addColumn('users', 'reset_password_ttl', {
          type: Sequelize.DataTypes.DATE,
        }, { transaction }),
      ]);
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.removeColumn('users', 'reset_password_token', { transaction }),
        queryInterface.removeColumn('users', 'reset_password_ttl', { transaction }),
      ]);
    });
  }
};