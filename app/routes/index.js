let express = require('express');
let router = express.Router();
let { COOKIES_AGE, BTN_CTRL } = require('../config');

router.get('/', function(req, res, next) {
	res.render('index', BTN_CTRL);
});


router.get('/login-signup', (req, res, next)=>{
	BTN_CTRL.logout = false;
	res.render('login-signup', BTN_CTRL);
});

router.post('/login', (req, res, next)=>{
	console.log(req.body);
	res.status(302).redirect('/dashboard');
	//res.render('dash')
});

router.post('/signup', (req, res, next)=>{
	console.log(req.body);
	res.status(302).redirect('/dashboard');
	//res.render('dashboard', { lgbtn: false });
});
	
router.get('/dashboard', (req, res, next)=>{
	res.send('<h1>Available soon</h1>');
});

module.exports = router;