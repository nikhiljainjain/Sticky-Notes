//json response of invalid request
let invalidRes = {
    msg: "NOT OK", 
    data: "invalid request",
};

//json response of valid request
let validRes = {
    msg: "OK", 
    data: "ALL is WELL",
};

//time in sec of one day
const ONE_DAY_TIME_IN_MSEC = 86400000;

//cookies age is 400 days 
//calculated in microseconds
const COOKIES_AGE = (ONE_DAY_TIME_IN_MSEC * 400);

//for ejs pages
let ejsData = {
    //for toast page
    msg: null,
    icon: "cancel",
    color: "red",
    //notes
    uid: null, 
    user: null, 
    name: null,
    // user dashboard
    notes: null,
};

//snack bar
let ERROR_MSG = null;

//cookies properties
const COOKIE_PROP = {
    maxAge: COOKIES_AGE,
    path: '/',
    httpOnly: true,
    //secure will false if server running in dev or testing env
    secure: (process.env.NODE_ENV === 'production'),
    //sameSite: true,
    domain: process.env.DOMAIN_NAME
};

//mongo store option for development used for session storage
const mongo_store_dev = {
    url: process.env.TESTDB_URL,
    fallbackMemory: true
};

//mongo store option for production used for session storage
const mongo_store_pro = {
    url: process.env.MONGODB_URL,
    touchAfter:  60//Interval (in seconds) between session updates in db
};

module.exports = { invalidRes, validRes, COOKIES_AGE, ERROR_MSG, ejsData, COOKIE_PROP, ONE_DAY_TIME_IN_MSEC, mongo_store_dev, mongo_store_pro };