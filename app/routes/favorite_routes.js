// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for games
const Favorite = require('../models/favorite')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { game: { title: '', text: 'foo' } } -> { game: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

/////////////////////
// ROUTES ///////////
/////////////////////

// POST
router.post('/favorites/:gameId', requireToken, (req, res, next) => {
    const gameId = req.params.gameId
    const userId = req.user._id
    Favorite.create({ game: gameId, owner: userId})
        .then(favorite => {
            console.log(favorite)
            res.status(201).json({ favorite: favorite.toObject() })
        })
        .catch(next)
})

// GET
// show all the favorites for a user
router.get('/favorites', requireToken, (req, res, next) => {
    // console.log(req.user)
    const userId = req.user._id
    Favorite.find({ owner: userId})
        .populate('game')
        .populate('owner')
        .then((favorites) => {
            console.log(req)
            // requireOwnership(req, userId)
            return favorites.map((favorite) => favorite.toObject())
        })
        .then((favorites) => {
            // return favorites.map((favorite) => favorite.toObject())
            res.status(201).json({ favorites: favorites })
        })
        // .then(() => res.sendStatus(204))
        .catch(next)
  })

// DELETE
router.delete('/favorites/:favId', requireToken, (req, res, next) => {
    const favId = req.params
    Favorite.findById(favId)
        .then(handle404)
        .then(favorite => {
            // if we have an error, we look here
            requireOwnership(req, favorite)
            favorite.deleteOne()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

module.exports = router