const { db } = require('../utils/admin')

exports.getAllScreams = (req, res) => {
    db
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let screams = []
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt                })
            })
            return res.json(screams)
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.message })
        })
}

exports.postScream = (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
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
}