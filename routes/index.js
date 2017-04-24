var express = require('express');
var router = express.Router();
var baseUrl = global.properties.baseUrl();
var auth = require('./auth.js');
var mongoose = require("mongoose");

//Inject modules for repositories
var products = require('./repository/products');
var user = require('./repository/users');

db = mongoose.connect(global.properties.mongodb(), function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});
/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get(baseUrl + '/products', products.getAll);
router.get(baseUrl + '/product/:id', products.getOne);
router.post(baseUrl + '/product/', products.create);
router.put(baseUrl + '/product/:id', products.update);
router.delete(baseUrl + '/product/:id', products.delete);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get(baseUrl + '/admin/user/:id', user.getOne);
router.post(baseUrl + '/admin/user/', user.create);
router.put(baseUrl + '/admin/user/:id', user.update);
router.delete(baseUrl + '/admin/user/:id', user.delete);

module.exports = router;
