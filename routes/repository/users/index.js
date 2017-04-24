var mongoose = require("mongoose");
var Users = require("./users");

module.exports = {

  getOne: function(req, res) {
    var id = req.params.id;
    Users.findOne({ "_id" : req.params.id}).exec(function(err, response){
      if(err){
        res.json("Error has occured");
      }else{
        res.json(response);
      }
    }); 
  },

  getRole: function(username) {
    return Users.findOne({ "username" : username}).select('role').exec(); 
  },

  validate: function(username, password) {
      return Users.findOne({ "username": username }).exec().then(function(user) {
          // make sure the user exists
          if (!user) {
            console.log('USER NOT FOUND');  
            throw new Error('USER NOT FOUND');
            return null;
          }

          // check if the account is currently locked
          if (user.isLocked) {
              // just increment login attempts if account is already locked
              user.incLoginAttempts(function(err) {
                  if (err) throw err;
                  console.log('USER MAX_ATTEMPTS');
              });
              throw new Error('USER MAX_ATTEMPTS');
          }else{
            // test for a matching password
            var isMatch = user.comparePassword(password);
            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return user;
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates);
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) throw err;
                console.log('USER PASSWORD_INCORRECT');
            });
            throw new Error('USER PASSWORD_INCORRECT');
          }
      });
  },

  isAdmin: function(username) {
    return Users.findOne({ "username" : username, "role" : "admin" }).exec().then(function(admin){
      return admin ?  true : false;
    }, function(err){ throw err}); 
  },

  create: function(req, res) {
    var newuser = new Users(req.body);
    newuser.save(function(err){
      if(err){
        res.json("Error has occured");
      }else{
        res.json(true);
      }
    }); 
  },

  update: function(req, res) {
    var updateItem = req.body;
    Users.findOneAndUpdate({"id" : req.params.id}, updateItem, function(err, response){
      if(err){
        res.json("Error has occured on delete");
        res.status(204);
      }else{
        res.json(response);
      }
    });
  },

  delete: function(req, res) {
    Users.findOneAndRemove({"id" : req.params.id}, function(err, response){
      if(err){
        res.json("Error has occured on delete");
        res.status(204);
      }else{
        res.json(true);
      }
    }); 
  }
};


