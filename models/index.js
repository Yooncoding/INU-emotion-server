const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
const User = require("./user");
const Mood = require("./mood");
const Betting = require("./betting");
const Archive = require("./archive");

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Mood = Mood;
db.Betting = Betting;
db.Archive = Archive;

User.init(sequelize);
Mood.init(sequelize);
Betting.init(sequelize);
Archive.init(sequelize);

User.associate(db);
Mood.associate(db);
Betting.associate(db);
Archive.associate(db);

module.exports = db;
