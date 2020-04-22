let mongoose = require("mongoose");

let njlist = new mongoose.Schema({
	//notes uid
	notesUid: { 
		type: String, 
		default: null,
		select: false 
	},
	//unique id generator
	uid: { 
		type: String, 
		default: null 
	},
	//board name
	name: { 
		type: String, 
		default: "Mr. X"
	},
	//archive 
	archive: { 
		type: Boolean, 
		default: false,
		select: false
	},
	//creator
	creater: { 
		type: mongoose.Schema.ObjectId, 
		ref: "njnotesusers",
		select: false 
	},
	//assigned To (useful in team board)
	assignTo: { 
		type: mongoose.Schema.ObjectId, 
		ref: "njnotesuers" 
	},
	//creation time
    creationTime: { 
		type: Date, 
		default: Date.now,
		select: false 
	},
	//ip address
	registerIP: {
		type: String,
		default: null,
		select: false
	},
	//notes id
	cards: [ { 
		type: mongoose.Schema.ObjectId, 
		ref: 'njnotescards'
	} ]
});

module.exports = mongoose.model('njnoteslists', njlist);