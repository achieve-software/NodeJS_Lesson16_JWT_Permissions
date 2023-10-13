"use strict";
/* -------------------------------------------------------
    EXPRESS - Personnel API
------------------------------------------------------- */
/*
    $ npm i express dotenv mongoose express-async-errors
    $ npm i cookie-session
    $ npm i jsonwebtoken
*/

const express = require("express");
const app = express();

/* ------------------------------------------------------- */
//Required
require("dotenv").config();
const PORT = process.env?.PORT || 8000;

require("express-async-errors");
// continue from here...

//config

//connect to db
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();
/* ------------------------------------------------------- */

//middlewares

//accept json
app.use(express.json());

// SessionsCookies:
app.use(require("cookie-session")({ secret: process.env.SECRET_KEY }));

// res.getModelList():
app.use(require("./src/middlewares/findSearchSortPage"));

//Cookie: Login/Logout Control Middleware
// app.use(async (req, res, next) => {

//   const Personnel = require('./src/models/personnel.model')

//   req.isLogin = false

//   if (req.session?.id) {

//       const user = await Personnel.findOne({ _id: req.session.id })

//       // if (user && user.password == req.session.password) {
//       //     req.isLogin = true
//       // }
//       req.isLogin = user && user.password == req.session.password
//   }
//   console.log('isLogin: ', req.isLogin)

//   next()
// })

const jwt =require('jsonwebtoken')
app.use((req, res, next) =>{
  const auth = req.headers?.authorization || null
  const accessToken = auth ? auth.split(' ')[1] : null
  req.isLogin = false

    jwt.verify(accessToken, process.env.ACCESS_KEY, function(err, user) {
        if (err) {
            req.user = null
            console.log('JWT Login: NO')
        } else {
            req.isLogin = true
            req.user = user
            // req.user = user.isActive ? user : null
            console.log('JWT Login: YES')
        }
    })
  next()
})






// Routes:

// HomePath:
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to PERSONNEL API",
    session: req.session,
    isLogin: req.isLogin,
  });
});

// /auth
app.use('/auth', require('./src/routes/auth.router'))
//departments
app.use("/departments", require("./src/routes/department.router"))

//personnels
app.use("/personnels", require("./src/routes/personnel.router"))


// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log("http://127.0.0.1:" + PORT));

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')()
