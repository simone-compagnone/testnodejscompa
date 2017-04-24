var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var productSchema = new Schema({
	name:String,
	id:Number
});
module.exports = mongoose.model("products", productSchema);