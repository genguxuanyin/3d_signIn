// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Danmaku = require('../../models/Danmaku');
const SignInUser = require('../../models/SignInUser');
const Activity = require('../../models/Activity');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// @route  GET api/signInUsers
// @desc   return all signInUsers
// @access Private
router.get(
    '/',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res, next) => {
        Danmaku.findAll(
            {
            include: [{
                model: Activity,
                attributes:['id','name']
            },{
                model: SignInUser,
                attributes:['name','phone']
            }]
        })
            .then(danmakus => {
                if (!danmakus) {
                    return res.status(404).json('没有任何内容');
                }
                danmakus = danmakus.map((item,index)=>{
                    return {
                        id:item.id,
                        name:item.t_signInUser.name,
                        phone:item.t_signInUser.phone,
                        activityId:item.t_activity.id,
                        activityName:item.t_activity.name,
                        message:item.message,
                        createdAt:item.createdAt,
                        updatedAt:item.updatedAt
                    }
                })
                res.json(danmakus);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err)
            });
    }
);

// @route  POST api/signInUsers/edit
// @desc   编辑用户信息接口
// @access Private
router.post(
    '/edit/:id',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res, next) => {
        const _user = {};
        if (req.body.name != undefined) _user.name = req.body.name;
        if (req.body.email != undefined) _user.email = req.body.email;
        if (req.body.password != undefined) _user.password = req.body.password;
        if (req.body.status != undefined) _user.status = req.body.status;
        SignInUser.update(_user, {
            where: {
                id: req.params.id
            }
        }).spread((affectedCount, affectedRows) => {
            if (affectedCount == 1) {
                SignInUser.findById(req.params.id).then((user) => {
                    if (!user) {
                        return res.status(404).json('没有任何内容');
                    }
                    res.json(user);
                }).catch(err => {
                    return res.status(404).json(err);
                })
            } else {
                return res.status(404).json('操作失败,请重试');
            }
        });
    }
);

// @route  GET api/signInUsers/current
// @desc   return current user
// @access Private
router.get(
    '/current',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res, next) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            identity: req.user.identity
        });
    }
);

module.exports = router;