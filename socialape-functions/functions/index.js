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

const isEmpty = (str) => {
    if (str.trim() == '') return true
    return false
}

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (email.match(regEx)) return true
    return false
}

// Signup route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }

    let errors = {}

    if (isEmpty(newUser.email)) errors.email = 'Must not be empty'
    else if (!isEmail(newUser.email)) errors.email = 'Must be a valid email address'

    if (isEmpty(newUser.password)) errors.password = 'Must not be empty'

    if (newUser.password !== newUser.confirmPassword) errors.confirmPassword == 'Passwords must match'

    if (isEmpty(newUser.handle)) errors.handle = 'Must not be empty'

    if (Object.keys(errors).length > 0) return res.status(400).json(errors)

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
            return res.status(500).json({ error: err.message })
        })
})

app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    let errors = {}

    if (isEmpty(user.email)) errors.email = 'Must not be empty'
    if (isEmpty(user.password)) errors.password = 'Must not be empty'

    if (Object.keys(errors).length > 0) return res.status(400).json(errors)

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken()
        })
        .then(token => {
            return res.json({ token })
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.message })
        })
})

exports.api = functions
    .region('asia-east2')
    .https.onRequest(app)