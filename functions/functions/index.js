const functions = require('firebase-functions');

const express = require('express')
const app = express()

const FirebaseAuth = require('./utils/fb-auth')

const cors = require('cors')
app.use(cors())

const { db } = require('./utils/admin')

const { 
    getAllGibbers, 
    postGibber, 
    getGibber, 
    commentOnGibber, 
    likeGibber, 
    unlikeGibber, 
    deleteGibber 
} = require('./handlers/gibbers')

const { 
    signup, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead
} = require('./handlers/users')

// Gibber routes
app.get('/gibbers', getAllGibbers)
app.post('/gibber', FirebaseAuth, postGibber)
app.get('/gibber/:gibberId', getGibber)
app.delete('/gibber/:gibberId', FirebaseAuth, deleteGibber)
app.get('/gibber/:gibberId/like', FirebaseAuth, likeGibber)
app.get('/gibber/:gibberId/unlike', FirebaseAuth, unlikeGibber)
app.post('/gibber/:gibberId/comment', FirebaseAuth, commentOnGibber)

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
            .doc(`/gibbers/${snapshot.data().gibberId}`)
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
                            gibberId: doc.id
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
            .doc(`/gibbers/${snapshot.data().gibberId}`)
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
                            gibberId: doc.id
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
                .collection('gibbers')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then(data => {
                    data.forEach(doc => {
                        const gibber = db.doc(`/gibbers/${doc.id}`)
                        batch.update(gibber, { userImage: change.after.data().imageUrl })
                    })
                    return batch.commit()
                })
        }
        return true
    })

exports.onGibberDelete = functions
    .region('asia-east2')
    .firestore.document('/gibbers/{gibberId}')
    .onDelete((snapshot, context) => {
        const gibberId = context.params.gibberId
        const batch = db.batch()
        return db
            .collection('comments')
            .where('gibberId', '==', gibberId)
            .get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`))
                })
                return db
                    .collection('likes')
                    .where('gibberId', '==', gibberId)
                    .get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`))
                })
                return db
                    .collection('notifications')
                    .where('gibberId', '==', gibberId)
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