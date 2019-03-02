const sequelize = require('../db/connect');
const Sequelize = require('sequelize');
const moment = require('moment');
const OrderRefGoods = sequelize.define('t_orders_goods_ref', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tGoodId:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tOrderId:{
        type: Sequelize.INTEGER,
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
},{
    freezeTableName: true
});

module.exports = OrderRefGoods;