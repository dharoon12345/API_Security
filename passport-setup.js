const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
passport.use(new GoogleStrategy({
	clientID:process.env.ID, // Your Credentials here.
	clientSecret:process.env.SCRETE, // Your Credentials here.
	callbackURL:"https://api-security-d7v2.onrender.com/google/callback",
	passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
	//console.log(profile)
	return done(null, profile);
}
));
passport.serializeUser(function(user , done){
	done(null , user);
})
passport.deserializeUser(function(user, done){
	
	done(null, user);
});