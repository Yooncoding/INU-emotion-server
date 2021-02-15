const Sequelize = require("sequelize");

module.exports = class Betting extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        bet_mood: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Betting",
        tableName: "bettings",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Betting.belongsTo(db.User);
  }
};
