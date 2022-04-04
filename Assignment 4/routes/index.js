const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const users = require('../models/users')

router.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {username: req.user.username})
})

router.get('/login', checkNotAuthenticated, (req, res) =>{
    res.render('login.ejs')
})

router.get('/signup', checkNotAuthenticated, (req, res) =>{
    res.render('signup.ejs')
})

router.post('/signup', checkNotAuthenticated, async(req, res) => {
    try{
        const {username, password} = req.body;
        //validate
        //status code 400 means bad request
        //status code 500 means internal server error

        if(!username || !password) {
            return res.status(400).json({ msg: "Please make sure all fields have been entered."})
        }

        //checking to ensure password length is at least 5 characters
        if (password.length < 5) {
            return res
                .status(400)
                .json({ msg: "The password needs to be at lease 5 characters long."});
        }

        //checking database to ensure no duplicate usernames upon signup
        //check username : username in our databse
        const existingUser = await users.findOne({ username: username });
        if(existingUser) {
            return res
                .status(400)
                .json({ msg: "An account with this username already exists."});
        }

        //using Bcrypt to hash password for security
        else {
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = new users({
                username: username,
                password: passwordHash
            });

        //log new user info to terminal and save new user to database
            console.log(newUser)
            newUser.save()
            .then(user => {
                console.log(`User ${username} registered to database.`)
                res.redirect('/login')
            }).catch(err => {
                console.log(err)
            })            
        }

    } catch (error) {
        res.status(500).json({err: error.message });
    }
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
}))

//method override npm package allows us to call delete
//route for logging the user out
router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

//protects routes from users that are not logged in
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

//exports file to server
module.exports = router