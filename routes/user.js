const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const users = require('../models/users')

router.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {username: req.user.username})
})

router.get('/profile', checkAuthenticated, (req,res) => {
    res.render('profile.ejs')
})

router.get('/fuelQuoteForm', checkAuthenticated, (req,res) => {
    res.render('fuelQuoteForm.ejs')
})

router.get('/fuelQuoteHistory', checkAuthenticated, (req,res) => {
    res.render('fuelQuoteHistory.ejs')
})

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
    res.redirect('/signup')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = router