const Sequelize = require("sequelize");

module.exports = class Betting extends Sequelize.Model {
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
