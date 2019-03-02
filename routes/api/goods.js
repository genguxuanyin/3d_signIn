// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const sequelize = require('../../db/connect');
const zxfs = require('../../config/fs');

const Goods = require('../../models/Goods');
const GoodsIcons = require('../../models/GoodsIcons');
const Orders = require('../../models/Orders');
const OrdersRefGoods = require('../../models/OrdersRefGoods');


//关于文件上传
const fs = require("fs");
const multer = require('multer');
const upload = multer();

// @route  GET api/goods/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res, next) => {
  res.json({
    msg: 'goods works'
  });
});

// @route  POST api/goods/add
// @desc   创建信息接口
// @access Private
router.post(
  '/add',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    const goodsFields = {};
    if (req.body.type) goodsFields.type = req.body.type;
    if (req.body.name) goodsFields.name = req.body.name;
    if (req.body.icon) goodsFields.icon = req.body.icon;
    if (req.body.inventory) goodsFields.inventory = req.body.inventory;
    if (req.body.sales) goodsFields.sales = req.body.sales;
    if (req.body.unitPrice) goodsFields.unitPrice = req.body.unitPrice;
    if (req.body.sort) goodsFields.sort = req.body.sort;
    if (req.body.remark) goodsFields.remark = req.body.remark;
    return sequelize.transaction(async (t) => {
      // 在这里链接您的所有查询。 确保你返回他们。
      let goods = await Goods.create(goodsFields, {
        transaction: t
      });
      let icon = goodsFields.icon;
      for (var i = 0; i < icon.length; i++) {
        await goods.createT_goods_icon({
          uid: icon[i].uid,
          name: icon[i].name,
          url: icon[i].url,
          status: icon[i].status
        }, {
          transaction: t
        });
      }
      return goods;

    }).then(function (result) {
      res.json(result);
      // 事务已被提交
      // result 是 promise 链返回到事务回调的结果
    }).catch(function (err) {
      res.json(err);
      // 事务已被回滚
      // err 是拒绝 promise 链返回到事务回调的错误
    });
  }
);

// @route  GET api/goods
// @desc   获取所有信息
// @access Private

router.get(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    Goods.findAll({
        include: [{
            model: GoodsIcons
          }
          /* , {
                    model: OrdersRefGoods,
                    include: [{
                      model: Orders
                    }]
                  } */
        ]
      })
      .then(goods => {
        console.log(goods);
        if (!goods) {
          return res.status(404).json('没有任何内容');
        }
        res.json(goods);
      })
      .catch(err => {
        console.log(err);
        res.status(404).json(err)
      });
  }
);

// @route  GET api/goods/:id
// @desc   获取单个信息
// @access Private

router.get(
  '/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    Goods.findAll({
        where: {
          id: req.params.id
        },
        include: [{
          model: GoodsIcons
        }]
      })
      .then(goods => {
        if (!goods) {
          return res.status(404).json('没有任何内容');
        }
        res.json(goods);
      })
      .catch(err => res.status(404).json(err));
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
  async (req, res, next) => {
    try {
      const goodsFields = {};
      if (req.body.status != undefined) {
        goodsFields.status = req.body.status;
        Goods.update(goodsFields, {
          where: {
            id: req.params.id
          }
        }).then((goods) => {
          res.json(goods);
        }).catch((err) => {
          next(err);
        });
        return;
      }
      if (req.body.type) goodsFields.type = req.body.type;
      if (req.body.name) goodsFields.name = req.body.name;
      if (req.body.icon) goodsFields.icon = req.body.icon;
      if (req.body.inventory) goodsFields.inventory = req.body.inventory;
      if (req.body.sales) goodsFields.sales = req.body.sales;
      if (req.body.unitPrice) goodsFields.unitPrice = req.body.unitPrice;
      if (req.body.sort) goodsFields.sort = req.body.sort;
      if (req.body.remark) goodsFields.remark = req.body.remark;
      let goods = await Goods.findById(req.params.id);
      let oldIcon = await goods.getT_goods_icons();
      let newIcon = goodsFields.icon;
      let deleteIcon = oldIcon.filter(oi => {
        return newIcon.every((ni) => {
          return ni.url != oi.url;
        })
      });
      let addIcon = newIcon.filter(ni => {
        return oldIcon.every((oi) => {
          return oi.url != ni.url;
        })
      });
      if (deleteIcon.length == 0) {
        delete goodsFields.icon;
        return sequelize.transaction(async (t) => {
          let _goods = await goods.update(goodsFields, {
            transaction: t
          });
          for (let i = 0; i < addIcon.length; i++) {
            let icon = addIcon[i];
            await _goods.createT_goods_icon({
              uid: icon.uid,
              name: icon.name,
              url: icon.url,
              status: icon.status
            }, {
              transaction: t
            });
          }
          return _goods;
        }).then(function (result) {
          res.json(result);
        }).catch(function (err) {
          res.json(err);
        });
      } else {
        let url = `${__dirname}/../../uploads/`;
        return sequelize.transaction(async (t) => {
          let _goods = await goods.update(goodsFields, {
            transaction: t
          });
          for (let i = 0; i < deleteIcon.length; i++) {
            let di = deleteIcon[i];
            await zxfs.remove(`${url}${di.url}`);
            await _goods.removeT_goods_icon(di, {
              transaction: t
            });
            if (i + 1 >= deleteIcon.length) {
              for (let j = 0; j < addIcon.length; j++) {
                let icon = addIcon[j];
                await _goods.createT_goods_icon({
                  uid: icon.uid,
                  name: icon.name,
                  url: icon.url,
                  status: icon.status
                }, {
                  transaction: t
                });
              }
              return _goods;
            }
          }
        }).then(function (result) {
          res.json(result);
        }).catch(function (err) {
          res.json(err);
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

// @route  POST api/goods/delete/:id
// @desc   删除信息接口
// @access Private
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  async (req, res, next) => {
    try {
      let goods = await Goods.findById(req.params.id, {
        include: [{
          model: GoodsIcons
        }]
      });
      let deleteIcon = goods.t_goods_icons;
      if (deleteIcon.length == 0) {
        return sequelize.transaction(async (t) => {
          await goods.setT_goods_icons([], {
            transaction: t
          });
          return goods.destroy({
            transaction: t
          });

        }).then(function (result) {
          res.json(result);
        }).catch(function (err) {
          res.json(err);
        });;
      } else {
        let url = `${__dirname}/../../uploads/`;
        for (let i = 0; i < deleteIcon.length; i++) {
          let di = deleteIcon[i];
          await zxfs.remove(`${url}${di.url}`);
          if (i + 1 >= deleteIcon.length) {
            return sequelize.transaction(async (t) => {
              await goods.setT_goods_icons([], {
                transaction: t
              });
              return goods.destroy({
                transaction: t
              });
            }).then(function (result) {
              res.json(result);
            }).catch(function (err) {
              res.json(err);
            });;
          }
        }
      }
    } catch (err) {
      next(err);
    }
  }
);

// @route  POST api/goods/upload
// @desc   上传商品图片接口
// @access Private

router.post(
  '/upload',
  upload.single('photos'),
  (req, res, next) => {
    // 上传的文件信息
    let path = `${__dirname}/../../uploads/`;
    let name = `${Date.now()}_${req.file.originalname}`;
    zxfs.write(`${path}${name}`, req.file.buffer).then(() => {
      res.json(name);
    }).catch((err) => {
      next(err);
    });
  }
);
module.exports = router;