const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const users = require('../models/users')

function initialize(passport, getUserByName, getUserById) {
	passport.use(new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
			// Compare username
			users.findOne({
				username: username
			})
			.then(user => {
				if(!user){
					return done(null, false, {message: 'Invalid credentials.'});
				}

				// Compare password
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if(err) throw err;

					if(isMatch){
						return done(null, user)
					} else{
						return done(null, false, {message: 'Invalid credentials.'})
					}
				})
			})
			.catch(err => console.log("Error :" + err))
		}))
	passport.serializeUser((user, done) =>  done(null, user._id))
    passport.deserializeUser((id, done) => {
        users.findById(id, function(err, user) {
        done(err, user)
        })
    })
}

module.exports = initialize