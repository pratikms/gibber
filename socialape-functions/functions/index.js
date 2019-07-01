const functions = require('firebase-functions');

const express = require('express')
const app = express()

const FirebaseAuth = require('./utils/fb-auth')

const { db } = require('./utils/admin')

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
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
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
app.get('/user/:handle', getUserDetails)
app.post('/notifications', FirebaseAuth, markNotificationsRead)

exports.api = functions
    .region('asia-east2')
    .https.onRequest(app)

exports.triggerNotificationOnLike = functions
    .region('asia-east2')
    .firestore.document('likes/{id}')
    .onCreate(snapshot => {
        db
            .doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    return db
                        .doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: 'like',
                            read: false,
                            screamId: doc.id
                        })
                }
            })
            .then(() => {
                return
            })
            .catch(err => {
                console.error(err)
                return
            })
    })

exports.deleteNotificationOnUnlike = functions
    .region('asia-east2')
    .firestore.document('likes/{id}')
    .onDelete(snapshot => {
        db
            .doc(`/notifications/${snapshot.id}`)
            .delete()
            .then(() => {
                return
            })
            .catch(err => {
                console.error(err)
                return
            })
    })

exports.triggerNotificationOnComment = functions
    .region('asia-east2')
    .firestore.document('comments/{id}')
    .onCreate(snapshot => {
        db
            .doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    return db
                        .doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: 'comment',
                            read: false,
                            screamId: doc.id
                        })
                }
            })
            .then(() => {
                return
            })
            .catch(err => {
                console.error(err)
                return
            })
    })