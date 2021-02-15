const { HasMany, BelongsTo } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = class Mood extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        select_mood: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        element_first: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        element_second: {
          type: Sequelize.STRING(15),
          allowNull: true,
        },
        element_third: {
          type: Sequelize.STRING(15),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Mood",
        tableName: "moods",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Mood.belongsTo(db.User);
  }
};
