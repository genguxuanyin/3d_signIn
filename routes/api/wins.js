// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const sequelize = require('../../db/connect');
const zxfs = require('../../config/fs');

const Win = require('../../models/Win');

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
      .then(win => res.json({id:win.id}))
      .catch(err => console.log(err))
  }
);


router.post('/', (req, res, next) => {
  console.log(req.body)
  const activityId = req.body.activityId;
  const signInUserId = req.body.signInUserId;
  Win.findAll({
          where: {
              [Op.and]: [{
                    activityId: activityId
                  },{
                    signInUserId: signInUserId
                  }
              ]
          }
      })
      .then(win => {
          res.json(win);
      })
      .catch(err => console.log(err))
});

module.exports = router;