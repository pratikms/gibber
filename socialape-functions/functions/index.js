const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()

const express = require('express')
const app = express()

const config = {
    apiKey: "AIzaSyDv92trGStubAbawKYlHKHJuHhNMm_URFs",
    authDomain: "socialape-b75ab.firebaseapp.com",
    databaseURL: "https://socialape-b75ab.firebaseio.com",
    projectId: "socialape-b75ab",
    storageBucket: "socialape-b75ab.appspot.com",
    messagingSenderId: "373529017430",
    appId: "1:373529017430:web:186146a6b7547f62"    
}

const firebase = require('firebase')
firebase.initializeApp(config)

const db = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions
    .region('asia-east2')
    .https.onRequest((request, response) => {
        response.send("Hello, world!");
    });

app.get('/screams', (req, res) => {
    db
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let screams = []
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    ...doc.data()
                })
            })
            return res.json(screams)
        })
        .catch(err => {
            console.error(err)
        })
})

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdt: new Date().toISOString()
    }

    db
        .collection('screams')
        .add(newScream)
        .then(doc => {
            return res.json({ message: `document ${doc.id} created successfully`})
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: 'Something went wrong. Please try again later. '})
        })
})

// Signup route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }

    let token, userId
    db.doc(`/users/${newUser.handle}`)
        .get()
        .then(doc => {
            if (doc.exists) return res.status(400).json({ handle: 'This handle is already taken' })
            return firebase
                .auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password)
        })
        .then(data => {
            userId = data.user.uid
            return data.user.getIdToken()
        })
        .then(idToken => {
            token = idToken
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredentials)
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch(err => {
            console.error(err)
            if (err.code == 'auth/email-already-in-use') return res.status(400).json({ email: 'Email is already in use' })
            return res.status(500).json({ error: err.code })
        })
})

exports.api = functions
    .region('asia-east2')
    .https.onRequest(app)