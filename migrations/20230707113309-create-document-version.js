'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DocumentVersions', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      isLatest: {
        type: Sequelize.BOOLEAN,
      },
      versionId: {
        type: Sequelize.STRING,
        unique: true
      },
      versionName: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      content: {
        type: Sequelize.TEXT,
      },
      body: {
        type: Sequelize.TEXT,
      },
      etag: {
        type: Sequelize.STRING,
      },
      lastModified: {
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // The name of the referenced table
          key: 'id' // The name of the referenced column
        }
      },
      documentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Documents', // The name of the referenced table
          key: 'id' // The name of the referenced column
        }
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
    await queryInterface.dropTable('DocumentVersions');
  }
};