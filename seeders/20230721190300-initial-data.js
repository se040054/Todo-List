'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.sequelize.query('ALTER TABLE Todos AUTO_INCREMENT = 1;'); //自行測試，因為undo回滾不會消除auto_increment的id增加導致每次重設時id+10
    await queryInterface.bulkInsert('Todos',
      Array.from({length:10}).map((_,i)=>
        ({
        name:`todo-${i}`,
        createdAt: new Date(),
        updatedAt: new Date()

        })
      )
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos',null,{})
  }
};
