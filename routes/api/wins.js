// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const sequelize = require('../../db/connect');
const zxfs = require('../../config/fs');

const Win = require('../../models/Win');
const SignInUser = require('../../models/SignInUser');
const Activity = require('../../models/Activity');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// @route  GET api/activity/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res, next) => {
  res.json({
    msg: 'win works'
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
    const fields = {};
    if (req.body.name != undefined) fields.name = req.body.name;
    if (req.body.activityId != undefined) fields.activityId = req.body.activityId;
    if (req.body.signInUserId != undefined) fields.signInUserId = req.body.signInUserId;
    if (req.body.remark != undefined) fields.remark = req.body.remark;
    if (req.body.status != undefined) fields.status = req.body.status;
    Win.create(fields)
      .then(win => res.json({
        id: win.id
      }))
      .catch(err => console.log(err))
  }
);


router.get(
  '/',
  passport.authenticate('jwt', {
    session: false
  }), (req, res, next) => {
    Win.findAll({
        include: [{
          model: Activity,
          attributes: ['id', 'name']
        }, {
          model: SignInUser,
          attributes: ['name', 'phone']
        }]
      })
      .then(wins => {
        if (!wins) {
          return res.status(404).json('没有任何内容');
        }
        wins = wins.map((item, index) => {
          return {
            id: item.id,
            name: item.t_signInUser.name,
            phone: item.t_signInUser.phone,
            activityId: item.t_activity.id,
            activityName: item.t_activity.name,
            winName: item.name,
            grade: item.grade,
            remark: item.remark,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }
        })
        res.json(wins);
      })
      .catch(err => console.log(err))
  });

module.exports = router;