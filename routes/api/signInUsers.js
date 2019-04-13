// @login & register
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const keys = require('../../config/keys');
const passport = require('passport');

const SignInUser = require('../../models/SignInUser');
const Activity = require('../../models/Activity');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// @route  GET api/signInUsers/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res, next) => {
    res.json({
        msg: 'SignInUser works'
    });
});

// @route  POST api/signInUsers/signIn
// @desc   返回的请求的json数据
// @access public
router.post('/signIn', (req, res, next) => {
    SignInUser.findOne({
            where: {
                [Op.and]: [{
                        phone: req.body.phone
                    },
                    {
                        tActivityId: req.body.activityId
                    }
                ]
            }
        })
        .then(user => {
            if (user) {
                return res.status(400).json('手机号已被使用');
            }
            return Activity.findById(req.body.activityId);
        })
        .then((activity) => {
            const newUser = new SignInUser({
                name: req.body.name,
                phone: req.body.phone,
                wechatId: req.body.wechatId,
                tActivityId: req.body.activityId,
                account: activity.account
            });
            newUser.save()
                .then(user => {
                    const rule = {
                        id: user.id
                    };
                    jwt.sign(rule, keys.secretOrKey, {
                        expiresIn: "1 days" //过期时间
                    }, (err, token) => {
                        if (err) next(err);
                        console.log('token:', token)
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        })
                    })
                })
                .catch(err => console.log(err))
        })
});

// @route  GET api/signInUsers
// @desc   return all signInUsers
// @access Private
router.get(
    '/',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res, next) => {
        SignInUser.findAll({
                include: [{
                    model: Activity,
                    attributes: ['name']
                }]
            })
            .then(signInUsers => {
                if (!signInUsers) {
                    return res.status(404).json('没有任何内容');
                }
                res.json(signInUsers);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err)
            });
    }
);

// @route  GET api/signInUsers
// @desc   return all signInUsers
// @access Private
router.get(
    '/:account',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res, next) => {
        SignInUser.findAll({
                where: {
                    account: req.params.account
                },
                include: [{
                    model: Activity,
                    attributes: ['name']
                }]
            })
            .then((signInUsers) => {
                res.json(signInUsers);
            })
            .catch(err => res.status(404).json(err));
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