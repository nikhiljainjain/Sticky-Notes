//installed packages
let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');

//self-made
let User = require('../database/model/users');
let { COOKIES_AGE, ERROR_MSG, validRes, ejsData, COOKIE_PROP } = require('../config');
const { bodyDataValidCred, bodyDataValidJSON } = require('../function');
const { jwtCreate } = require("../function/cookies"); 

//home page
router.get('/', (req, res)=>{
	console.log(req.statusCode)
	res.render('index');
});

//rendering login & signup page
router.get('/login-signup', (req, res)=>{
	//taking query and display to front end
	if (req.query.q){
		ejsData.msg = req.query.q;
		ejsData.color = (req.query.color) ? "green" : "red";
		ejsData.icon = (req.query.color) ? "check_circle":"cancel";
		req.query.q = null;
	}

	//removing token cookie if exist
	if (req.cookies.token){
		res.cookie("token", "", { maxAge: 0}).render('login-signup', ejsData);
	}else{
		res.render("login-signup", ejsData);
	}
});

router.get('/login', (req, res)=>{
	res.status(302).redirect("/login-signup");
});

//user login
router.post('/login', bodyDataValidCred, jwtCreate, (req, res)=>{

	//creating session variable to limit the login attempt
	if (req.cookies.count || (req.session.loginCount && req.session.loginCount > 5)){
		ERROR_MSG = "Try After 24hours";
		//restricting user for 24 hour to login attempt
		res.cookie('count', "dont", { maxAge: (COOKIES_AGE/400) }).status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
	}else{
		ERROR_MSG = 'Invalid credentials';
	
		let { email, password } = req.body;
		
		//initiating login attempts
		if (!req.session.loginCount)
			req.session.loginCount = 1;
		else{
			//increase login attempts
			req.session.loginCount++;
		}
		
		email = (email.trim()).toLowerCase();
		//finding user in db
		User.findOne({ email }, "password", (err, user)=>{
			if (err) console.error.bind('Database Error', err);
			console.log("User=", user);
			if (user && bcrypt.compareSync(password, user.password)){
				//setting cookies in db
				user.set({ cookie: req.data.token });
				user.save().then(()=>{
					//generating new session
					req.session.regenerate((err)=>{
						//console.log("req data", req.data);
						//sending response
						if (err) console.error.bind("Session error", err);
						res.cookie('token', req.data.jwt, COOKIE_PROP).status(302).redirect('/users');
					});
				});
			}else{
				req.session.loginCount++;
				res.status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
			}
		});
	}
});


router.get('/signup', (req, res)=>res.status(302).redirect("/login-signup"));

//user registration
router.post('/signup', bodyDataValidCred, jwtCreate, (req, res)=>{
	ERROR_MSG = "Password and Confirm Password are not same";
	
	if (req.body.password == req.body.cpassword){

		//checking for existence of user		
		User.findOne({ email: req.body.email }, (err, userExist)=>{
			//console.log(userExist);

			if (err) console.error.bind("DB error", err);
			//if user exist then sending back to login page
			if (userExist){
				ERROR_MSG = "User Already Exist";
				res.status(302).redirect(`/login-signup?q=${ERROR_MSG}&color=green`);
			}else{
				delete req.body.cpassword

				let newUser = {
					...req.body,
					cookie: req.data.token,
					registerIP: req.ip, 
					verificationCode: null
				};
				//hashing password
				newUser.password = bcrypt.hashSync(req.body.password);
				//creating new user for the data
				newUser = new User(newUser);

				//console.log(newUser);

				//sending email to user and email verification process will start
				newUser.save().then(()=>{
					req.session.regenerate((err)=>{
						if (err) console.error.bind("Session error", err);
						//console.log(req.data);
						//setting cookies
						res.cookie('token', req.data.jwt, COOKIE_PROP).status(302).redirect('/users');
					});
				});
			}
		});
	}else
		res.status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
});

//forget password page
router.get('/forget-password', (req, res)=>{
	//need to implement
	res.render("forget-password", ejsData);
});

router.post('/forget-password', bodyDataValidJSON, (req, res)=>{
	//prcoess forget password
	/*
	find the email in the database
	generate new verification link & save to db
	send email to the user with link
	*/
	res.json(validRes);
});

router.get('/forget-password/code/:verificationCode', (req, res)=>{
	res.render('new-password', ejsData);
});

router.post('/forget-password/code/:verificationCode', bodyDataValidJSON, (req, res)=>{
	res.json(validRes);
});

//email verification page
router.get('/email/verification/:verifyCode', (req, res)=>{
	User.findOne({ verificationCode: req.params.verifyCode }, "email password", (err, data)=>{
		if (err) console.error.bind("DB error", err);
		ejsData.msg = (data) ? null: "Invalid URL";
		res.render('email-verify', ejsData);
	});
});

//email verification 
router.post('/email/verification/:verifyCode', bodyDataValidCred, (req, res)=>{
	res.json(validRes);
});

//logout user
router.get('/logout', (req, res)=>{
    if (req.cookies.token != null && req.cookies.token != ""){
        User.findOneAndUpdate({ cookie: req.cookies.token }, { $set: { cookie: null }}, (err, data)=>{
            if (err) console.error.bind("Database error", err);
            //console.log(data, req.cookies);
            req.session.regenerate((err)=>{
                if (err) console.error.bind("Session error", err);
                if (data){
                    ejsData.msg = "Logout Successfully";
                    ejsData.icon = "check_circle";
                    ejsData.color = "green";
                }
                res.cookie('token', '', { maxAge: 0 }).render('login-signup', ejsData);
            });
        });
    }else{
        res.render('login-signup', ejsData);
    }
});

module.exports = router;