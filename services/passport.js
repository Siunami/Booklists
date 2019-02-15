const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

//fetch a model out of mongoose
const User = mongoose.model('users');

// pass a token to the client that the client has been authenticated as a user.
// serialize creates token
passport.serializeUser((user, done) => {
	// Not using googleId because can't assume every user will have one.
	// Might be using facebook auth. Can assume they have a unique mongoid.
	done(null, user.id);
});

// get cookie/token and check id of cookie is in mongo
passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	})
});

passport.use(
	new GoogleStrategy({
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
			proxy: true
		}, 
		async (accessToken, refreshToken, profile, done) => {
			// console.log('accesstoken', accessToken); // Allow us to do actions on behalf of user
			// console.log('refreshtoken', refreshToken); // Refresh access token which expires periodically
			// console.log('profile: ', profile);

			const existingUser = await User.findOne({ googleId: profile.id })
			if (existingUser){
				// we already have record with current id
				console.log("existing user", existingUser);
				return done(null, existingUser);
			}
			// Create a model instance and save to database
			const user = await new User({ googleId: profile.id }).save()
			console.log("new user:", user);
			done(null, user);
		}
	)
);