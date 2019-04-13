const sequelize = require('../db/connect');
const Sequelize = require('sequelize');
const moment = require('moment');
const SignInUser = require('./SignInUser');
const Danmaku = require('./Danmaku');
const Win = require('./Win');
const Activitys = sequelize.define('t_activity', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    num: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    contact: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    startTime: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('startTime')).format('YYYY-MM-DD');
        }
    },
    validity: {
        type: Sequelize.INTEGER
    },
    account: {
        type: Sequelize.STRING,
        allowNull: false
    },
    remark: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.INTEGER
    },
    createdAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    updatedAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    }
});

Activitys.hasMany(SignInUser);

SignInUser.belongsTo(Activitys);

Activitys.hasMany(Danmaku);

Danmaku.belongsTo(Activitys);

Activitys.hasMany(Win);

Win.belongsTo(Activitys);

module.exports = Activitys;