const { admin, db } = require('../utils/admin')

const config = require('../utils/config')

const firebase = require('firebase')
firebase.initializeApp(config)

const { validateSignUp, validateLogIn } = require('../utils/validate')

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }

    const { valid, errors } = validateSignUp(newUser)

    if (!valid) return res.status(400).json(errors)

    const noImage = 'no-img.png'

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
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
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
}

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const { valid, errors } = validateLogIn(user)

    if (!valid) return res.status(400).json(errors)

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
}

exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy')
    const path = require('path')
    const os = require('os')
    const fs = require('fs')

    const busboy = new BusBoy({ headers: req.headers })

    let imageFileName
    let imageToBeUploaded = {}

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') return res.status(400).json({ error: 'Unsupported file type' })
        console.log(fieldname)
        console.log(filename)
        console.log(mimetype)
        const imageExtension = filename.split('.')[filename.split('.').length - 1]
        imageFileName = `${Math.round(Math.random() * 10000000)}.${imageExtension}`
        console.log('Image file name on file: ' + imageFileName)
        const filepath = path.join(os.tmpdir(), imageFileName)
        console.log('Filepath: ' + filepath)
        imageToBeUploaded = { filepath, mimetype }
        console.log('imageToBeUploaded on file: ')
        console.log(imageToBeUploaded)
        file.pipe(fs.createWriteStream(filepath))
    })
    console.log('Image file name in between: ' + imageFileName)
    busboy.on('finish', () => {
        console.log('imageToBeUploaded on finish: ')
        console.log(imageToBeUploaded)
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            console.log('Image file name on finish: ' + imageFileName)
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            console.log('Image URL: ' + imageUrl)
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl })
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully' })
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.message })
        })
    })
    busboy.end(req.rawBody)
}