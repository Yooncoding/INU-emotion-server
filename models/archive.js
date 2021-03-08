const Sequelize = require("sequelize");

module.exports = class Archive extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        mood: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        element_first: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        element_second: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        element_third: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Archive",
        tableName: "archive",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {}
};
