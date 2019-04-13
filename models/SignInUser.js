const sequelize = require('../db/connect');
const Sequelize = require('sequelize');
const moment = require('moment');
const Danmaku = require('./Danmaku');
const Win = require('./Win');
const SignInUser = sequelize.define('t_signInUser', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    wechatId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tActivityId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    account:{
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
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
    },
    status: {
        type: Sequelize.INTEGER
    }
});

SignInUser.hasMany(Danmaku);

Danmaku.belongsTo(SignInUser);

SignInUser.hasMany(Win);

Win.belongsTo(SignInUser);

module.exports = SignInUser;