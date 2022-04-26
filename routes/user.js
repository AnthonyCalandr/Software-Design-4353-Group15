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
    if(req.user.userDetails.length> 0){
        res.render('profile.ejs', {message: "Resubmit to update your information"})
    } else{
    res.render('profile.ejs', {message: ""})
    }
})

//get route for displaying edit profile and users profile page
router.get('/userProfile', checkAuthenticated, (req, res) => {

    console.log(req.user)

    if(req.user.userDetails.length > 0){
        const{name, address1, address2, city, zipcode, state} = req.user.userDetails[0]

        let userInfo = {
            name: name,
            address1: address1,
            address2: address2,
            city: city,
            zipcode: zipcode,
            state: state
        }

    res.render('userProfile', {info: userInfo})
    } else{
        res.render('profile', {message: ""})
    }
})

//post route for saving clients profile information
router.post('/clientProfile', checkAuthenticated, (req, res) => {

    const {name, address1, address2, city, zipcode, state} = req.body

    //backend validation for client profile information 
    if(name.length > 50){
        res.render('profile', {message: "Name is required to be less than 50 characters"})
    }

    if(address1.length > 100){
        res.render('profile', {message: "Street Address 1 length is required to be less than 100 characters"})
    }

    if(address2.length > 100){
        res.render('profile', {message: "Street Address 2 length is required to be less than 100 characters"})
    }

    if(city.length > 100){
        res.render('profile', {message: "City length is required to be less than 100 characters"})
    }

    if(zipcode.length < 5){
        res.render('profile', {message: "Zipcode is required to be at least 5 characters"})
    } else if(zipcode.length > 9){
        res.render('profile', {message: "Zipcode is required to be less than 10 characters"})
    } else {

        let clientInfo = {
            name: name,
            address1: address1,
            address2: address2,
            city: city,
            zipcode: zipcode,
            state: state
        }

        let info = []
        info.push(clientInfo)

        let username = req.user.username

        users.findOneAndUpdate({username: username}, {userDetails: info}, ()=> {
            console.log("Client information submitted")
        })

        res.redirect('/user/userProfile')
    }

})

//get route for displaying the fuel quote form page
router.get('/fuelQuoteForm', checkAuthenticated, (req,res) => {
    if(req.user.userDetails.length > 0){

    let address1 = req.user.userDetails[0].address1
    let state = req.user.userDetails[0].state
    let quote = req.user.fuelQuotes.length

    res.render('fuelQuoteForm', {address: address1, quote: quote, state: state, message: ""})
    } else{
        res.render('profile', {message: "Please finish setting up your profile to gain access to fuel quote"})
    }
})

//get route for displaying the fuel quote history page
router.get('/fuelQuoteHistory', checkAuthenticated, (req,res) => {
    if(req.user.userDetails.length > 0){
    let fuelHistory = req.user.fuelQuotes
    let address1 = req.user.userDetails[0].address1

    res.render('fuelQuoteHistory', {fuelHistory, address: address1})
    } else {
        res.render('profile', {message: "Please finish setting up your profile to gain access to your fuel quote history"})
    }
})

//post route for saving the clients fuel quote information
router.post('/fuelQuoteInfo', checkAuthenticated, (req, res) =>{
    let username = req.user.username
    const {gallons, address, date, price, total} = req.body
    let fQuote = req.user.fuelQuotes

    let quoteInfo = {
        gallons: gallons,
        address: address,
        date: date,
        price: price,
        total: total
    }

    fQuote.push(quoteInfo)

    users.findOneAndUpdate({username: username}, {fuelQuotes: fQuote}, () =>{
        console.log("Fuel Quote submitted")
    })
    res.redirect('/user/fuelQuoteHistory')
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