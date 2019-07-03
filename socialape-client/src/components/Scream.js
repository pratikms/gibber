import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PropTypes from 'prop-types'

// MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux'
import { likeScream, unlikeScream } from '../redux/actions/data-actions'
import { Chat, FavoriteBorder, Favorite } from '@material-ui/icons';

import CustomIconButton from '../utils/CustomIconButton'
import DeleteScream from './DeleteScream';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
}

class Scream extends Component {

    likedScream = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.screamId === this.props.scream.screamId)) {
            return true
        }
        return false
    }

    likeScream = () => {
        this.props.likeScream(this.props.scream.screamId)
    }

    unlikeScream = () => {
        this.props.unlikeScream(this.props.scream.screamId)
    }

    render() {

        dayjs.extend(relativeTime)

        const { 
            classes, 
            scream : { 
                body, 
                createdAt, 
                userImage, 
                userHandle , 
                screamId, 
                likeCount, 
                commentCount 
            },
            user: {
                authenticated,
                credentials: {
                    handle
                }
            }
        } = this.props

        const likeButton = !authenticated ? (
            <CustomIconButton tip="Like">
                <Link to="/login">
                    <FavoriteBorder color="primary" />
                </Link>
            </CustomIconButton>
        ) : (
            this.likedScream() ? (
                <CustomIconButton tip="Unlike" onClick={this.unlikeScream}>
                    <Favorite color="primary" />
                </CustomIconButton>
            ) : (
                <CustomIconButton tip="Like" onClick={this.likeScream}>
                    <FavoriteBorder color="primary" />
                </CustomIconButton>
            )
        )

        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteScream screamId={screamId} />
        ) : null

        return (
            <Card className={classes.card}>
                <CardMedia 
                    image={userImage} 
                    title="ProfileImage"
                    className={classes.image}
                />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userHandle}`} color="primary">{userHandle}</Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{body}</Typography>
                    {likeButton}
                    <span>{likeCount ? likeCount : 0} Likes</span>
                    <CustomIconButton tip="comments">
                        <Chat color="primary" />
                    </CustomIconButton>
                </CardContent>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likeScream,
    unlikeScream
}

Scream.propTypes = {
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Scream))