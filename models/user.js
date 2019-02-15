const mongoose = require('mongoose');
// Equivalent to below 
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const userSchema = new Schema({
	googleId: String,
	credits: { type: Number, default: 0 }
});

// add a model to mongoose
mongoose.model('users', userSchema);