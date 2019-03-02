// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const sequelize = require('../../db/connect');

const User = require('../../models/User');
const Goods = require('../../models/Goods');
const Orders = require('../../models/Orders');
const OrdersRefGoods = require('../../models/OrdersRefGoods');
const GoodsIcons = require('../../models/GoodsIcons');

// @route  GET api/orders/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res, next) => {
  res.json({
    msg: 'orders works'
  });
});

// @route  GET api/orders
// @desc   return all orders
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    let currentPage = 1,
      count = 10;
    let offset = (currentPage - 1) * count;
    Orders.findAll({
        /* limit: parseInt(count),
        offset, */
        include: [{
          model: User,
          attributes: ['name', 'phone', 'address']
        }, {
          model: OrdersRefGoods,
          include: [{
            model: Goods,
            include: [{
              model: GoodsIcons
            }]
          }]
        }],
        attributes: ['id', 'No', 'totalPrice', 'status', 'createdAt', 'tUserId']
      })
      .then(orders => {
        if (!orders) {
          return res.status(404).json('没有任何内容');
        }
        res.json(orders);
      })
      .catch(err => {
        res.status(404).json(err)
      });
  }
);


// @route  POST api/orders/add
// @desc   创建信息接口
// @access Private
router.post(
  '/add',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    const ordersFields = {};
    if (req.body.No) ordersFields.No = req.body.No;
    if (req.body.tUserId) ordersFields.tUserId = req.body.tUserId;
    if (req.body.totalPrice) ordersFields.totalPrice = req.body.totalPrice;
    return sequelize.transaction(async (t) => {
      // 在这里链接您的所有查询。 确保你返回他们。
      let order = await Orders.create(ordersFields, {
        transaction: t
      });
      //[{"id":45,"amount":3},{"id":46,"amount":4}]
      let goodsIds = JSON.parse(req.body.goodsIds);
      for (var i = 0; i < goodsIds.length; i++) {
        await OrdersRefGoods.create({
          tGoodId: goodsIds[i].id,
          tOrderId: order.id,
          amount: goodsIds[i].amount
        }, {
          transaction: t
        });
        let goods = await Goods.findById(goodsIds[i].id);
        goods.inventory -= goodsIds[i].amount;
        if(goods.inventory < 0){
          throw new Error(`商品<${goods.name}>库存不足`);
        }
        goods.selling += goodsIds[i].amount;
        await goods.save({
          transaction: t
        });
      }
      return order;

    }).then(function (result) {
      res.json(result);
      // 事务已被提交
      // result 是 promise 链返回到事务回调的结果
    }).catch(function (err) {
      res.status(404).json(err.message);
      // 事务已被回滚
      // err 是拒绝 promise 链返回到事务回调的错误
    });
  }
);

// @route  POST api/goods/edit
// @desc   编辑信息接口
// @access Private
router.post(
  '/edit/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    const ordersFields = {};
    if (req.body.No) ordersFields.No = req.body.No;
    if (req.body.tUserId) ordersFields.tUserId = req.body.tUserId;
    // if (req.body.goodsIds) ordersFields.goodsIds = req.body.goodsIds;
    if (req.body.totalPrice) ordersFields.totalPrice = req.body.totalPrice;
    if (req.body.status) ordersFields.status = req.body.status;
    return sequelize.transaction(async (t) => {
      let order = await Orders.findOne({
        /* limit: parseInt(count),
        offset, */
        where: {
          id: req.params.id
        },
        include: [{
          model: OrdersRefGoods,
          include: [{
            model: Goods,
            attributes: ['id', 'selling', 'sales']
          }],
          attributes: ['id', 'amount']
        }],
        attributes: ['id', 'No', 'totalPrice', 'status', 'createdAt', 'tUserId']
      });
      if (req.body.status != undefined) {
        order.status = req.body.status;
        await order.save({
          transaction: t
        });
        for (let i = 0; i < order.t_orders_goods_refs.length; i++) {
          let o_g_r = order.t_orders_goods_refs[i];
          if (order.status == 1) {
            o_g_r.t_good.selling -= o_g_r.amount;
            o_g_r.t_good.sales += o_g_r.amount;
          } else if (order.status == 0) {
            o_g_r.t_good.selling += o_g_r.amount;
            o_g_r.t_good.sales -= o_g_r.amount;
          }
          await o_g_r.t_good.save({
            transaction: t
          });
        }
      }
      return order;
    }).then(function (result) {
      res.json(result);
      // 事务已被提交
      // result 是 promise 链返回到事务回调的结果
    }).catch(function (err) {
      res.status(404).json(err.message);
      // 事务已被回滚
      // err 是拒绝 promise 链返回到事务回调的错误
    });
  }
);
module.exports = router;