//properties file

exports.mongodb = function() {
  return process.env.MONGOLAB_URI || 'mongodb://localhost/test' ; 
}

exports.baseUrl = function() {
  return '/api/v1';
}