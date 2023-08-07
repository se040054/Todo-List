"use strict";
const bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction;
    try {
      const hash = await bcrypt.hash("12345678", 10);
      transaction = await queryInterface.transaction();
      await queryInterface.sequelize.query(
        "ALTER TABLE Todos AUTO_INCREMENT = 1;"
      ); //自行測試，因為undo回滾不會消除auto_increment的id增加導致每次重設時id+10
      await queryInterface.bulkInsert(
        "Users",
        [
          {
            id: 1,
            account: "root",
            email: "user1@example.com",
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );
      await queryInterface.bulkInsert(
        "Todos",
        Array.from({ length: 10 }).map((_, i) => ({
          name: `todo-${i}`,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      if (transaction) {
        transaction.rollback();
      }
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
