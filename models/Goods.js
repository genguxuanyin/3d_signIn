const sequelize = require('../db/connect');
const Sequelize = require('sequelize');
const moment = require('moment');
const GoodsIcons = require('./GoodsIcons');
const OrdersRefGoods = require('./OrdersRefGoods');
const Goods = sequelize.define('t_good', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    /* icon: {
        type: Sequelize.STRING,
        allowNull: false
    }, */
    inventory: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    selling: {
        type: Sequelize.INTEGER
    },
    sales: {
        type: Sequelize.INTEGER
    },
    unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER
    },
    sort: {
        type: Sequelize.INTEGER
    },
    remark: {
        type: Sequelize.STRING
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

Goods.hasMany(GoodsIcons);

GoodsIcons.belongsTo(Goods);

Goods.hasMany(OrdersRefGoods);

OrdersRefGoods.belongsTo(Goods);

module.exports = Goods;