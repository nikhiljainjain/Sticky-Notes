let User = require("../database/model/users");
let shortid = require('shortid');
let { invalidRes } = require('../config');
let flag, i;

const { e505 } = require('../config/error');

//checking same origin of request and https protocol
const checkURLDetailsPage = (req, res, next)=>{
	invalidRes.data = "Invalid host OR Insecure protcols";
	console.log(req.protocol, req.hostname);
	if (process.env.NODE_ENV === 'PRODUCTION'){
		if ((req.protocol === "https") && (req.hostname === "www.mrnotes.me" || req.host === "mrnote.herokuapp.com"))
			next();
		else 
			res.status(505).render("error-display", e505);
	}else
		next();
};

//checking same origin of request and https protocol
const checkURLDetailsJSON = (req, res, next)=>{
	invalidRes.data = "Invalid host OR Insecure protcols";
	console.log(req.protocol, req.hostname);
	if (process.env.NODE_ENV === 'PRODUCTION'){
		if ((req.protocol === "https") && (req.hostname === "www.mrnotes.me" || req.host === "mrnote.herokuapp.com"))
			next();
		else 
			res.status(505).json(invalidRes);
	}else
		next();
};

//data validation of login or signup page 
const bodyDataValidCred = (req, res, next)=>{
	flag = true;
	for (i in req.body)
		flag = (req.body[`${i}`] != ('' || null)) ? true: false; 
	flag ? next():res.status(302).redirect(`${req.path}/?q=Invalid User Details`);
}; 

//data validation 
const bodyDataValidJSON = (req, res, next)=>{
	//console.log(req.path);
	invalidRes.data = "Invalid Data";
	flag = true;
	for (i in req.body)
		flag = (req.body[`${i}`] != ('' || null)) ? true: false; 
	flag ? next():res.json(invalidRes);
}; 

//user cookies validation
const cookieValid = (req, res, next) =>{
	//extracting cookies from req parameter
  	let cookie = req.cookies.token;
	if (cookie != null){
		/*.populate("notes")*/
		User.findOne({cookie}).exec((err, data)=>{
			if (err) throw console.error.bind(err);
			if (data){
				req.data = data;
				//calling next process
				next();
			}else
				res.status(302).redirect("/login-signup");		  
		});	
	}else
		res.status(302).redirect("/login-signup");
};

//uid validation generated by shortid
const validId = (req, res, next) => {
	flag = true;
	//console.log(req.params);
	for(i in req.params){
		//console.log(shortid.isValid(req.params[`${i}`]), req.params[`${i}`]);
		flag = (shortid.isValid(req.params[`${i}`])) ? true: false;
	}
	//console.log(flag);
	flag ? next():res.json(invalidRes);
};

module.exports = { bodyDataValidCred, bodyDataValidJSON, validId, cookieValid, checkURLDetailsPage, checkURLDetailsJSON };