// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const sequelize = require('../../db/connect');
const zxfs = require('../../config/fs');

const Activities = require('../../models/Activity');

// @route  GET api/activity/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res, next) => {
  res.json({
    msg: 'activity works'
  });
});

// @route  POST api/activity/add
// @desc   创建信息接口
// @access Private
router.post(
  '/add',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    const activitiesFields = {};
    console.log(req.body);
    if (req.body.name != undefined) activitiesFields.name = req.body.name;
    if (req.body.num != undefined) activitiesFields.num = req.body.num;
    if (req.body.contact != undefined) activitiesFields.contact = req.body.contact;
    if (req.body.phone != undefined) activitiesFields.phone = req.body.phone;
    if (req.body.startTime != undefined) activitiesFields.startTime = req.body.startTime;
    if (req.body.validity != undefined) activitiesFields.validity = req.body.validity;
    if (req.body.account != undefined) activitiesFields.account = req.body.account;
    if (req.body.remark != undefined) activitiesFields.remark = req.body.remark;
    Activities.create(activitiesFields)
      .then(user => res.json({id:user.id}))
      .catch(err => console.log(err))
  }
);

// @route  GET api/activity
// @desc   获取所有信息
// @access Private

router.get(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    Activities.findAll()
      .then(activity => {
        console.log(activity);
        if (!activity) {
          return res.status(404).json('没有任何内容');
        }
        res.json(activity);
      })
      .catch(err => {
        console.log(err);
        res.status(404).json(err)
      });
  }
);

// @route  GET api/activity/:account
// @desc   获取单个信息
// @access Private

router.get(
  '/:account',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    Activities.findAll({
        where: {
          account: req.params.account
        }
      })
      .then(activity => {
        if (!activity) {
          return res.status(404).json('没有任何内容');
        }
        res.json(activity);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route  GET api/activity/:id
// @desc   获取单个信息
// @access Private

router.get(
  '/show/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    Activities.findAll({
        where: {
          id: req.params.id
        }
      })
      .then(activity => {
        if (!activity) {
          return res.status(404).json('没有任何内容');
        }
        res.json(activity);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route  POST api/activity/edit
// @desc   编辑信息接口
// @access Private
router.post(
  '/edit/:id',
  passport.authenticate('jwt', {
    session: false
  }),(req, res, next) => {
      console.log(req.body);
      const activitiesFields = {};
      if (req.body.name != undefined) activitiesFields.name = req.body.name;
      if (req.body.num != undefined) activitiesFields.num = req.body.num;
      if (req.body.contact != undefined) activitiesFields.contact = req.body.contact;
      if (req.body.phone != undefined) activitiesFields.phone = req.body.phone;
      if (req.body.startTime != undefined) activitiesFields.startTime = req.body.startTime;
      if (req.body.validity != undefined) activitiesFields.validity = req.body.validity;
      if (req.body.account != undefined) activitiesFields.account = req.body.account;
      if (req.body.remark != undefined) activitiesFields.remark = req.body.remark;
      if (req.body.status != undefined) activitiesFields.status = req.body.status;
      Activities.update(activitiesFields, {
          where: {
              id: req.params.id
          }
      }).spread((affectedCount, affectedRows) => {
          if (affectedCount == 1) {
            Activities.findById(req.params.id).then((activity) => {
                  if (!activity) {
                      return res.status(404).json('操作失败,请重试');
                  }
                  res.json(activity);
              }).catch(err => {
                  return res.status(404).json(err);
              })
          } else {
              return res.status(404).json('操作失败,请重试');
          }
      })
      .catch((err)=>{
        console.log(err);
      })
  }
);

// @route  POST api/activity/delete/:id
// @desc   删除信息接口
// @access Private
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', {
    session: false
  }),(req, res, next) => {
    Activities.destroy({
      where: {
        id: req.params.id
      }
    })
    .then((result)=>{
      res.json(result);
    }).catch((err)=>{
      console.log(err);
    })
  }
);

module.exports = router;