const sequelize = require('../db/connect');
const Sequelize = require('sequelize');
const moment = require('moment');
const User = require('./User');
const OrdersRefGoods = require('./OrdersRefGoods');
const Order = sequelize.define('t_order', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    No: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: Sequelize.DECIMAL,
        allowNull: false
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

// User.hasMany(Order);
Order.belongsTo(User);// 将会添加 tUserId 到 Order 模型

Order.hasMany(OrdersRefGoods);

OrdersRefGoods.belongsTo(Order);

module.exports = Order;