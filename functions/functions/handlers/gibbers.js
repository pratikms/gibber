const { db } = require('../utils/admin')

exports.getAllGibbers = (req, res) => {
    db
        .collection('gibbers')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let gibbers = []
            data.forEach(doc => {
                console.log('Data: ')
                console.log(doc.data())
                gibbers.push({
                    gibberId: doc.id,
                    ...doc.data()
                })
            })
            return res.json(gibbers)
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.message })
        })
}

exports.postGibber = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty' });
    }    
    const newGibber = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    }

    db
        .collection('gibbers')
        .add(newGibber)
        .then(doc => {
            const resGibber = newGibber
            resGibber.gibberId = doc.id
            return res.json(resGibber)
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: 'Something went wrong. Please try again later. '})
        })
}

// Fetch a single gibber
exports.getGibber = (req, res) => {
    let gibberData = {}
    db
        .doc(`/gibbers/${req.params.gibberId}`)
        .get()
        .then(doc => {
            if (!doc.exists) return res.status(404).json({ error: 'Gibber not found' })
            gibberData = doc.data()
            gibberData.gibberId = doc.id
            return db
                .collection('comments')
                .orderBy('createdAt', 'desc')
                .where('gibberId', '==', req.params.gibberId)
                .get()
        })
        .then(data => {
            gibberData.comments = []
            data.forEach(doc => {
                gibberData.comments.push(doc.data())
            })
            return res.json(gibberData)
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.message })
        })
}

// Comment on a comment
exports.commentOnGibber = (req, res) => {
    if (req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty' })
    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        gibberId: req.params.gibberId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    }

    db
        .doc(`/gibbers/${req.params.gibberId}`)
        .get()
        .then(doc => {
            if (!doc.exists) return res.status(404).json({ error: 'Gibber not found' })
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
        })
        .then(() => {
            return db.collection('comments').add(newComment)
        })
        .then(() => {
            return res.json(newComment)
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.message })
        })
}

// Like a gibber
exports.likeGibber = (req, res) => {
    const likeDoc = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('gibberId', '==', req.params.gibberId)
        .limit(1)

    const gibberDoc = db.doc(`/gibbers/${req.params.gibberId}`)

    let gibberData = {}

    gibberDoc
        .get()
        .then(doc => {
            if (doc.exists) {
                gibberData = doc.data()
                gibberData.gibberId = doc.id
                return likeDoc.get()
            } else return res.status(404).json({ error: 'Gibber not found' })
        })
        .then(data => {
            if (data.empty) {
                return db
                    .collection('likes')
                    .add({
                        gibberId: req.params.gibberId,
                        userHandle: req.user.handle
                    })
                    .then(() => {
                        gibberData.likeCount++
                        return gibberDoc.update({ likeCount: gibberData.likeCount })
                    })
                    .then(() => {
                        return res.json(gibberData)
                    })
            } else return res.status(400).json({ error: 'Gibber already liked' })
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: err.message })
        })
}

exports.unlikeGibber = (req, res) => {
    const likeDoc = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('gibberId', '==', req.params.gibberId)
        .limit(1)

    const gibberDoc = db.doc(`/gibbers/${req.params.gibberId}`)

    let gibberData = {}

    gibberDoc
        .get()
        .then(doc => {
            if (doc.exists) {
                gibberData = doc.data()
                gibberData.gibberId = doc.id
                return likeDoc.get()
            } else return res.status(404).json({ error: 'Gibber not found' })
        })
        .then(data => {
            if (data.empty) return res.status(400).json({ error: 'Gibber not liked' })
            else {
                return db
                    .doc(`/likes/${data.docs[0].id}`)
                    .delete()
                    .then(() => {
                        gibberData.likeCount--;
                        return gibberDoc.update({ likeCount: gibberData.likeCount })
                    })
                    .then(() => {
                        return res.json(gibberData)
                    })
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: err.message })
        })
}

// Delete gibber
exports.deleteGibber = (req, res) => {
    const document = db.doc(`/gibbers/${req.params.gibberId}`)
    document
        .get()
        .then(doc => {
            if (!doc.exists) return res.status(404).json({ error: 'Gibber not found' })
            if (doc.data().userHandle !== req.user.handle) return res.status(403).json({ error: 'Unauthorized' })
            return document.delete()
        })
        .then(() => {
            return res.json({ message: 'Gibber deleted successfully' })
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ error: err.message })
        })
}