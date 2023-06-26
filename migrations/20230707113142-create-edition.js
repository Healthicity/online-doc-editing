'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Editions', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      documentDraftId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Documents', // The name of the referenced table
          key: 'id' // The name of the referenced column
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // The name of the referenced table
          key: 'id' // The name of the referenced column
        },
      },
      content: {
        type: Sequelize.TEXT,
      },
      body: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Editions');
  }
};

// 20230707113216