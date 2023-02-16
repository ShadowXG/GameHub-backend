// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Game = require('../models/game')

// custom middleware
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// ROUTES

// Create
router.post('/comments/:gameId', (req, res, next) => {
    const comment = req.body.comment
    const gameId = req.params.gameId
    Game.findById(gameId)
        .then(handle404)
        .then(game => {
            console.log('the game: ', game)
            console.log('the comment: ', comment)
            game.comments.push(comment)

            return game.save()
        })
        .then(game => res.status(201).json({ game: game }))
        .catch(next)
})

// PATCH -> update a comment
// PATCH /comments/:gameId/:commentId
router.patch('/comments/:gameId/:commentId', requireToken, removeBlanks, (req, res, next) => {
    const gameId = req.params.gameId
    const commentId = req.params.commentId

    // find our game
    Game.findById(gameId)
        .then(handle404)
        .then(game => {
            // single out the comment
            const theComment = game.comments.id(commentId)
            // make sure the user is the game's owner
            requireOwnership(req, game)
            // update accordingly
            theComment.set(req.body.comment)

            return game.save()
        })
        // send a status
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DELETE -> destroy a comment
// DELETE /comments/:gameId/:commentId
router.delete('/comments/:gameId/:commentId', requireToken, (req, res, next) => {
    const gameId = req.params.gameId
    const commentId = req.params.commentId

    // find the game
    Game.findById(gameId)
        .then(handle404)
        // grab the specific comment using it's id
        .then(game => {
            // isolate the comment
            const theComment = game.comments.id(commentId)
            // make sure the user is the owner of the game
            requireOwnership(req, game)
            // call remove on our comment subdoc
            theComment.remove()
            // return the saved game
            return game.save()
        })
        // send a response
        .then(() => res.sendStatus(204))
        // pass errors to our error handler (using next)
        .catch(next)
})

// export our router
module.exports = router