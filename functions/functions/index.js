const functions = require('firebase-functions');

const express = require('express')
const app = express()

const FirebaseAuth = require('./utils/fb-auth')

const cors = require('cors')
app.use(cors())

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
        return db
            .doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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
            .catch(err => {
                console.error(err)
            })
    })

exports.deleteNotificationOnUnlike = functions
    .region('asia-east2')
    .firestore.document('likes/{id}')
    .onDelete(snapshot => {
        return db
            .doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err => {
                console.error(err)
            })
    })

exports.triggerNotificationOnComment = functions
    .region('asia-east2')
    .firestore.document('comments/{id}')
    .onCreate(snapshot => {
        return db
            .doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then(doc => {
                if (doc.exists  && doc.data().userHandle !== snapshot.data().userHandle) {
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
            .catch(err => {
                console.error(err)
            })
    })

exports.onUserImageChange = functions
    .region('asia-east2')
    .firestore.document('/users/{userId}')
    .onUpdate(change => {
        console.log(change.before.data())
        console.log(change.after.data())
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            const batch = db.batch()
            return db
                .collection('screams')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then(data => {
                    data.forEach(doc => {
                        const scream = db.doc(`/screams/${doc.id}`)
                        batch.update(scream, { userImage: change.after.data().imageUrl })
                    })
                    return batch.commit()
                })
        }
        return true
    })

exports.onScreamDelete = functions
    .region('asia-east2')
    .firestore.document('/screams/{screamId}')
    .onDelete((snapshot, context) => {
        const screamId = context.params.screamId
        const batch = db.batch()
        return db
            .collection('comments')
            .where('screamId', '==', screamId)
            .get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`))
                })
                return db
                    .collection('likes')
                    .where('screamId', '==', screamId)
                    .get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`))
                })
                return db
                    .collection('notifications')
                    .where('screamId', '==', screamId)
                    .get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`))
                })
                return batch.commit()
            })
            .catch(err => console.error(err))
    })