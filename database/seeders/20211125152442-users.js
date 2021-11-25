'use strict';
const bcrypt = require('bcrypt');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
      await queryInterface.bulkInsert('Users', [{
        firstName: 'John ',
        lastName: 'Doe',
        email: 'john@gmail.com',
        password: bcrypt.hashSync('password',10)
      },
        {
        firstName: 'aya ',
        lastName: 'ahmed',
        email: 'aya1@gmail.com',
        password: bcrypt.hashSync('password',10)
     }
      ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
