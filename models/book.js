const mongoose = require('mongoose');
// Equivalent to below 
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const bookSchema = new Schema({
	title: String,
	authors: String,
	listYear: Number,
	list: String,
	prodLink: String,
	link: String,
	genre: [String],
	publishDate: String
});

// add a model to mongoose
mongoose.model('books', bookSchema);