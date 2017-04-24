var mongoose = require("mongoose");
var Products = require("./products");

module.exports = {

  getAll: function(req, res) {
    Products.find().sort({"id" : 1}).exec(function(err, allProducts){
      if(err){
        json.res("Error has occured");
      }else{
        res.json(allProducts);
      }
    });  
  },

  getOne: function(req, res) {
    Products.findOne({"id" : req.params.id}).exec(function(err, response){
      if(err){
        json.res("Error has occured");
      }else{
        res.json(response);
      }
    });  
  },

  create: function(req, res) {
    var newProduct = req.body;
    Products.create(newProduct, function(err, response){
      if(err){
        json.res("Error has occured");
      }else{
        res.json(response);
      }
    }); 
  },

  update: function(req, res) {
    var updateProduct = req.body;
    Products.findOneAndUpdate({"id" : req.params.id}, updateProduct, function(err, response){
      if(err){
        json.res("Error has occured on delete");
        res.status(204);
      }else{
        res.json(response);
      }
    });
  },

  delete: function(req, res) {
    Products.findOneAndRemove({"id" : req.params.id}, function(err, response){
      if(err){
        json.res("Error has occured on delete");
        res.status(204);
      }else{
        res.json(true);
      }
    }); 
  }
};


