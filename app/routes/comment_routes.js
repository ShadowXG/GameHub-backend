// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for games
const Game = require('../models/game')

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

// CREATE
router.post('/games/:gameId', requireToken, (req, res, next) => {
    const gameId = req.params.gameId
    // if we have errors, console.log this below 
    req.body.comment.author = req.user.id
    const theComment = req.body
    Game.findById(gameId)
        .then(handle404)
        .then(game => {
            game.comments.push(theComment)
            return game.save()
        })
        .then(game => {
            res.redirect(`/games/${game.id}`)
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// UPDATE
router.patch('/games/:gameId/:commId', requireToken, (req, res, next) => {
    const { gameId, commId } = req.params
    Game.findById(gameId)
        .then(handle404)
        .then(game => {
            const theComment = game.comments.id(commId)
            // if we have an error, we look here
            requireOwnership(req, game.comments.author)
            theComment.title = req.body.title
            theComment.note = req.body.note
            game.markModified('comments')
            game.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DELETE
router.delete('/games/:gameId/:commId', requireToken, (req, res, next) => {
    const { gameId, commId } = req.params
    Game.findById(gameId)
        .then(handle404)
        .then(game => {
            const theComment = game.comments.id(commId)
            // if we have an error, we look here
            requireOwnership(req, game.comments.author)
            theComment.remove()
            return game.save()
        })
        .then(() => res.sendStatus(204))
        .catch(next)
})

module.exports = router 