var jwt = require('jwt-simple');
var user = require('./repository/users');

var auth = {

  login: function(req, res) {

    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    auth.validate(username, password).then(function(dbUserObj){
      if(dbUserObj){
        res.json(genToken(dbUserObj));
      } 
      else{
        throw new Error('ERROR VALIDATE USER');
      }
    }).catch(function(){
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
    });
  },

  validate: function(username, password) {
    return user.validate(username,password);

   /* var dbUserObj = { 
      name: 'arvind',
      role: 'admin',
      username: 'arvind@myapp.com'
    };

    return dbUserObj;*/
  },

  getUserRole: function(username) {
    return user.getRole(username);
  },

  isAdmin: function(username) {
    return user.isAdmin(username);
  },
}

// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret').secretKey(),'HS512');

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
