//visit npmjs website & search for package then you will documentation about the package

//default package installed by expressjs generator
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

//package installed for this project
require("dotenv").config();
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const helmet = require("helmet");
const dosPrev = require('ddos');
const MongoStore = require("connect-mongo")(session);

//files made for this project
const { mongo_store_dev, COOKIE_PROP, mongo_store_pro, ONE_DAY_TIME_IN_MSEC, ejsData } = require('./app/config');
const indexRouter = require('./app/routes/index');
const usersRouter = require('./app/routes/users');
const teamsRouter = require('./app/routes/teams');
const shareLinksRouter = require('./app/routes/shareLinks');
const database = require('./app/database/connect');

//dos attack preventtion configuration
const noDos = new dosPrev({
	burst: 15,
	limit: 25,
	maxCount: 35
});

//checking server is running in production env or dev
const production_env = process.env.NODE_ENV === 'production';

//connecting to database
database.connect(production_env);

//defining log method
const logMethod =  production_env ? 'combined' : 'dev';

//mongo store
const mongo_store_option =  production_env ? mongo_store_pro : mongo_store_dev;

//setting ejsdata msg value to null
ejsData.msg = null;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//code generated by expressjs
app.use(logger(logMethod));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//read expressjs documentation
app.disable('etag');
app.use(helmet());
app.use(noDos.express);

//special config for this project
app.use(noDos.express);
app.use(expressSanitizer());
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: "sessionId",
    resave: true,
    rolling: true,
    saveUninitialized: false,
    store: new MongoStore(mongo_store_option),
    cookie:{
        ...COOKIE_PROP,
        maxAge: ONE_DAY_TIME_IN_MSEC
    }
}));

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/teams', teamsRouter);
app.use('/shareLinked', shareLinksRouter);

// catch 404 and forward to error handler
app.use((req, res, next)=>next(createError(404)));

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = !production_env ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


console.log(`Server running on Port ${process.env.PORT || 3000}`);
module.exports = app;