const functions = require('firebase-functions');

const express = require('express')
const app = express()

const FBAuth = require('./utils/fb-auth')

const { getAllScreams, postScream } = require('./handlers/screams')
const { signup, login } = require('./handlers/users')

// Scream routes
app.get('/screams', getAllScreams)
app.post('/scream', FBAuth, postScream)

// Users routes
app.post('/signup', signup)
app.post('/login', login)

exports.api = functions
    .region('asia-east2')
    .https.onRequest(app)