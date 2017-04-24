var mongoose = require("mongoose");
var Schema = mongoose.Schema;
enableAttempsLogic = true;
var bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10,
// these values can be whatever you want - we're defaulting to a
// max of 5 attempts, resulting in a 2 hour lock
MAX_LOGIN_ATTEMPTS = 5,
LOCK_TIME = 2 * 60 * 60 * 1000;

var UserSchema  = new Schema({
    role: 			{ type: String, required: true, default: "user" },
	name: 			String,
	surname: 		String,
    username: 		{ type: String, required: true, index: { unique: true } },
    password: 		{ type: String, required: true },
    loginAttempts: 	{ type: Number, required: true, default: 0 },
    lockUntil: 		{ type: Number, default: 0 },
  	created_at: 	Date,
  	updated_at: 	Date
});

// on every save, add the date
UserSchema.pre('save', function(next) {
	var user = this;
	// only hash the password if it has been modified (or is new)
	if (user.isModified('password')){
		user.password = bcrypt.hashSync(user.password, SALT_WORK_FACTOR);
	}
	// get the current date
	var currentDate = new Date();
	// change the updated_at field to current date
	this.updated_at = currentDate;
	// if created_at doesn't exist, add to that field
	if (!this.created_at) this.created_at = currentDate;
	//go next
	next();
});

UserSchema.virtual('isLocked').get(function() {
	if(!enableAttempsLogic) return false;
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});


UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

UserSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }else{
    	// otherwise we're incrementing
	    var updates = { $inc: { loginAttempts: 1 } };
	    // lock the account if we've reached max attempts and it's not locked already
	    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
	        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
	    }
	    this.update(updates, cb);
    }
};


module.exports = mongoose.model("User", UserSchema );