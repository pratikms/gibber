let db = {
    users = [
        {
            userId: 'sdf',
            email: 'user@mail.com',
            handle: 'user',
            createdAt: '2019-06-29T19:21:11.256Z',
            imageUrl: 'image/sdf/sdf',
            bio: 'Hello',
            website: 'https://dfsf.com',
            location: 'India'
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2019-06-29T19:21:11.256Z',
            likeCount: 5,
            commentCount: 2
        }
    ]
}

const userDetails = {
    credentials: {
        userId: 'sdf',
        email: 'user@mail.com',
        handle: 'user',
        createdAt: '2019-06-29T19:21:11.256Z',
        imageUrl: 'image/sdf/sdf',
        bio: 'Hello',
        website: 'https://dfsf.com',
        location: 'India'
    },
    likes: [
        {
            userHandle: 'user',
            screamId: 'sdflklrter'
        },
        {
            userHandle: 'user',
            screamId: 'lkjlklrter'
        }
    ]
}