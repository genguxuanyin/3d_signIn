// @login & register
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const keys = require('../../config/keys');
const zxfs = require('../../config/fs');
const passport = require('passport');

//关于文件上传
const fs = require("fs");
const multer = require('multer');
const upload = multer();

const User = require('../../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// @route  GET api/users/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res, next) => {
    res.json({
        msg: 'login works'
    });
});

// @route  POST api/users/register
// @desc   返回的请求的json数据
// @access public
router.post('/register', (req, res, next) => {
    //查询数据是否有邮箱
    console.log('email:', req.body.email)
    User.findOne({
            where: {
                [Op.or]: [{
                        name: req.body.name
                    },
                    {
                        email: req.body.email
                    }
                ]
            }
        })
        .then(user => {
            if (user) {
                return res.status(400).json(user.name == req.body.name ? '用户名已被注册' : '邮箱已被注册');
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                });
                // console.log(newUser)
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // Store hash in your password DB.
                        if (err) {
                            next(err);
                        }
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json({id:user.id}))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
});

router.post('/login', (req, res, next) => {
    const account = req.body.account;
    const password = req.body.password;
    User.findOne({
            where: {
                [Op.or]: [{
                        name: account
                    },
                    {
                        email: account
                    }
                ]
            }
        })
        .then(user => {
            if (!user) {
                return res.status(404).json('用户不存在');
            }
            if (user.status == 0) {
                return res.status(404).json('对不起,您的账号已被禁用,请联系管理员');
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    console.log('isMatch:', isMatch)
                    if (isMatch) {
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
                    } else {
                        return res.status(400).json("密码错误");
                    }
                })
        })
});

// @route  GET api/users
// @desc   return all users
// @access Private
router.get(
    '/',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res, next) => {
        User.findAll()
            .then(users => {
                if (!users) {
                    return res.status(404).json('没有任何内容');
                }
                res.json(users);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err)
            });
    }
);

// @route  GET api/users/id
// @desc   return user by id
// @access Private
router.get(
    '/:id',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res, next) => {
        User.findById(req.params.id).then(user => {
                if (!user) {
                    return res.status(404).json('没有任何内容');
                }
                res.json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(404).json(err)
            });

    }
);

// @route  POST api/users/edit
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
        User.update(_user, {
            where: {
                id: req.params.id
            }
        }).spread((affectedCount, affectedRows) => {
            if (affectedCount == 1) {
                User.findById(req.params.id).then((user) => {
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

// @route  POST api/users/file
// @desc   上传用户头像接口
// @access Private

router.post(
    '/file/:id',
    upload.single('avatar'),
    /*     passport.authenticate('jwt', {
            session: false
        }), */
    async (req, res, next) => {
        // 上传的文件信息
        let path = `${__dirname}/../../uploads/`;
        let name = `${Date.now()}_${req.file.originalname}`;
        try {
            let user = await User.findById(req.params.id);
            await zxfs.remove(`${path}${user.avatar}`);
            await zxfs.write(`${path}${name}`, req.file.buffer);
            user.avatar = name;
            user.save().then((user) => {
                res.json(user);
            });
        } catch (err) {
            next(err);
        }
    }
);

// @route  GET api/users/current
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