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
import { Chat } from '@material-ui/icons';

import CustomIconButton from '../../utils/CustomIconButton'
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog'
import LikeButton from './LikeButton';

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
                    <LikeButton screamId={screamId} />
                    <span>{likeCount ? likeCount : 0} likes</span>
                    <CustomIconButton tip="comments">
                        <Chat color="primary" />
                    </CustomIconButton>
                    <span>{commentCount ? commentCount : 0} comments</span>
                    <ScreamDialog screamId={screamId} userHandle={userHandle} openDialog={this.props.openDialog} />
                </CardContent>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

Scream.propTypes = {
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
}

export default connect(mapStateToProps)(withStyles(styles)(Scream))
