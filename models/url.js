const mongoose = require('mongoose');
// Equivalent to below 
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const urlSchema = new Schema({
	url: String
});

// add a model to mongoose
mongoose.model('recommendations', urlSchema);