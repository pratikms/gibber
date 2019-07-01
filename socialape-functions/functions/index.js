const functions = require('firebase-functions');

const express = require('express')
const app = express()

const FirebaseAuth = require('./utils/fb-auth')

const { 
    getAllScreams, 
    postScream, 
    getScream, 
    commentOnScream, 
    likeScream, 
    unlikeScream, 
    deleteScream 
} = require('./handlers/screams')
const { 
    signup, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser 
} = require('./handlers/users')

// Scream routes
app.get('/screams', getAllScreams)
app.post('/scream', FirebaseAuth, postScream)
app.get('/scream/:screamId', getScream)
app.delete('/scream/:screamId', FirebaseAuth, deleteScream)
app.get('/scream/:screamId/like', FirebaseAuth, likeScream)
app.get('/scream/:screamId/unlike', FirebaseAuth, unlikeScream)
app.post('/scream/:screamId/comment', FirebaseAuth, commentOnScream)

// Users routes
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/image', FirebaseAuth, uploadImage)
app.post('/user', FirebaseAuth, addUserDetails)
app.get('/user', FirebaseAuth, getAuthenticatedUser)

exports.api = functions
    .region('asia-east2')
    .https.onRequest(app)