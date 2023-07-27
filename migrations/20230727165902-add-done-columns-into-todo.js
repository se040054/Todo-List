'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
    'Todos' ,
    'done' , 
      { type: Sequelize.BOOLEAN ,
        defaultValue: false,
        allowNull: false}
      )
    },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Todos',
      'done'
      );
  }
};
