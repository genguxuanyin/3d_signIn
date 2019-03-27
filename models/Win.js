const sequelize = require('../db/connect');
const Sequelize = require('sequelize');
const moment = require('moment');
const Wins = sequelize.define('t_win', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tActivityId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tSignInUserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    grade:{
        type: Sequelize.STRING
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

module.exports = Wins;