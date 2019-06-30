const functions = require('firebase-functions');

const express = require('express')
const app = express()

const FirebaseAuth = require('./utils/fb-auth')

const { getAllScreams, postScream } = require('./handlers/screams')
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users')

// Scream routes
app.get('/screams', getAllScreams)
app.post('/scream', FirebaseAuth, postScream)
app.post('/user/image', FirebaseAuth, uploadImage)
app.post('/user', FirebaseAuth, addUserDetails)
app.get('/user', FirebaseAuth, getAuthenticatedUser)

// Users routes
app.post('/signup', signup)
app.post('/login', login)

exports.api = functions
    .region('asia-east2')
    .https.onRequest(app)