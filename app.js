/*
 * Copyright (c) Visual Interaction Systems. All rights reserved.
 * Licensed under the MIT License.
 * 
 * Product :  Visual Tracker Application Platform
 * Modulo  :  Modulo Central de Inicio (app.js)
 * 
 */


// Configuracion local :
require('dotenv').config();

// Librerias Genericas Backend
var path = require('path');
var express = require('express');
var session = require('express-session');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Routers :
var indexRouter = require('./routes/index');    // Router de Inicio
var usersRouter = require('./routes/users');    // Router de Usuarios
var authRouter = require('./routes/auth');      // Ruta de Autentificacion
var frontRouter = require('./routes/front');    // Ruta de Fron End
var apiRouter = require('./routes/backendServices');   // Ruta de Servicios de backend

const cors = require('cors');

// initialize express
var app = express();

app.use(cors());
app.options('*', cors());

//router.use(cors());
//app.use("/",router);



app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' "
  );
  res.removeHeader('Server');
  next();
});


/**
 * Middleware para el manejo de sesiones 
*/
 
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // habilita para production
    }
}));

// Setup de engine para vistas 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));

// Inicio de ruteo :
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/api',apiRouter);
app.use('/front', frontRouter);


// Intercepcion de errores 404 y forward hacia Error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// uso de Error handler
app.use(function (err, req, res, next) {
    // Uso de locals, solo habilitado en modo de desarrollo
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
