const sequelize = require('../db/connect');
const Sequelize = require('sequelize');
const moment = require('moment');
const Danmaku = sequelize.define('t_danmaku', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tSignInUserId: {
        type: Sequelize.INTEGER,
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
    message: {
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
    }
});
module.exports = Danmaku;