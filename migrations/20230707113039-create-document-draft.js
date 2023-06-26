'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DocumentDrafts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      bucket: {
        type: Sequelize.STRING,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      path: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.TEXT,
      },
      body: {
        type: Sequelize.TEXT,
      },
      extension: {
        type: Sequelize.STRING,
      },
      contentLength: {
        type: Sequelize.INTEGER,
      },
      etag: {
        type: Sequelize.STRING,
      },
      lastModified: {
        type: Sequelize.DATE,
      },
      stateId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'States', // The name of the referenced table
          key: 'id' // The name of the referenced column
        }
      },
      users: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        // references: {
        //   model: 'Users', // The name of the referenced table
        //   key: 'id', // The name of the referenced column
        //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        // },
        defaultValue: []
      },
      documentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Documents', // The name of the referenced table
          key: 'id' // The name of the referenced column
        }
      },
      userConfirmations: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('DocumentDrafts');
  }
};