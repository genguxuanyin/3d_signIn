const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const app = express();

// 引入users.js
const users = require('./routes/api/users');
const activities = require('./routes/api/activities');

app.use(express.static(path.join(__dirname, 'uploads')));
// DB config
// const db = require('./config/keys').mongoURI;

// 使用body-parser中间件
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Connect to mongodb
/* mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err)); */

// passport 初始化
app.use(passport.initialize());

require('./config/passport')(passport);

// app.get("/",(req,res) => {
//   res.send("Hello World!");
// })

// 使用routes
app.use('/api/users', users);
app.use('/api/activities', activities);

/* //处理404
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

//处理错误
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
}) */

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});