// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const sequelize = require('../../db/connect');
const zxfs = require('../../config/fs');

const Activities = require('../../models/Activity');

// @route  GET api/activitys/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res, next) => {
  res.json({
    msg: 'activitys works'
  });
});

// @route  POST api/activitys/add
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
    if (req.body.name) activitiesFields.name = req.body.name;
    if (req.body.num) activitiesFields.num = req.body.num;
    if (req.body.contact) activitiesFields.contact = req.body.contact;
    if (req.body.phone) activitiesFields.phone = req.body.phone;
    if (req.body.startTime) activitiesFields.startTime = req.body.startTime;
    if (req.body.validity) activitiesFields.validity = req.body.validity;
    if (req.body.account) activitiesFields.account = req.body.account;
    if (req.body.password) activitiesFields.password = req.body.password;
    if (req.body.remark) activitiesFields.remark = req.body.remark;
    Activities.create(activitiesFields)
      .then(user => res.json({id:user.id}))
      .catch(err => console.log(err))
  }
);

// @route  GET api/activitys
// @desc   获取所有信息
// @access Private

router.get(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    Activities.findAll()
      .then(activitys => {
        console.log(activitys);
        if (!activitys) {
          return res.status(404).json('没有任何内容');
        }
        res.json(activitys);
      })
      .catch(err => {
        console.log(err);
        res.status(404).json(err)
      });
  }
);

// @route  GET api/activitys/:id
// @desc   获取单个信息
// @access Private

router.get(
  '/:id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res, next) => {
    Activities.findAll({
        where: {
          id: req.params.id
        }
      })
      .then(activitys => {
        if (!activitys) {
          return res.status(404).json('没有任何内容');
        }
        res.json(activitys);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route  POST api/activitys/edit
// @desc   编辑信息接口
// @access Private
router.post(
  '/edit/:id',
  passport.authenticate('jwt', {
    session: false
  }),(req, res, next) => {
      const activitiesFields = {};
      if (req.body.name) activitiesFields.name = req.body.name;
      if (req.body.num) activitiesFields.num = req.body.num;
      if (req.body.contact) activitiesFields.contact = req.body.contact;
      if (req.body.phone) activitiesFields.phone = req.body.phone;
      if (req.body.startTime) activitiesFields.startTime = req.body.startTime;
      if (req.body.validity) activitiesFields.validity = req.body.validity;
      if (req.body.account) activitiesFields.account = req.body.account;
      if (req.body.password) activitiesFields.password = req.body.password;
      if (req.body.remark) activitiesFields.remark = req.body.remark;
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

// @route  POST api/activitys/delete/:id
// @desc   删除信息接口
// @access Private
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', {
    session: false
  }),(req, res, next) => {
    Activities.findById(req.params.id).then((activity)=>{
      activity.destroy().then((result)=>{
        res.json(result);
      }).catch((err)=>{
        console.log(err);
      })
    })
    .then((activity)=>{
      res.json(activity);
    })
    .catch((err)=>{
      console.log(err);
    });
  }
);

module.exports = router;