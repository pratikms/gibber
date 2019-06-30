const functions = require('firebase-functions');

const express = require('express')
const app = express()

const FBAuth = require('./utils/fb-auth')

const { getAllScreams, postScream } = require('./handlers/screams')
const { signup, login, uploadImage } = require('./handlers/users')

// Scream routes
app.get('/screams', getAllScreams)
app.post('/scream', FBAuth, postScream)

// Users routes
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)

exports.api = functions
    .region('asia-east2')
    .https.onRequest(app)