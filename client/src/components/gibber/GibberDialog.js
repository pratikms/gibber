import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'

import { connect } from 'react-redux'
import { getGibber, clearErrors } from '../../redux/actions/data-actions'

import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

// Icons
import { Dialog, DialogContent, CircularProgress, Grid, Typography } from '@material-ui/core';
import theme from '../../utils/theme';
import CustomIconButton from '../../utils/CustomIconButton';
import { Close, UnfoldMore, Chat } from '@material-ui/icons';
import LikeButton from './LikeButton';
import Comments from './Comments'
import CommentForm from './CommentForm'

const styles = {
    ...theme,
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
}

class GibberDialog extends Component {

    state = {
        open: false,
        oldPath: '',
        newPath: ''
    }

    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen() 
        }
    }

    handleOpen = () => {
        let oldPath = window.location.pathname
        const { userHandle, gibberId } = this.props
        const newPath = `/users/${userHandle}/gibber/${gibberId}`
        window.history.pushState(null, null, newPath)

        if (oldPath === newPath) oldPath = `/users/${userHandle}`

        this.setState({ open: true, oldPath, newPath })
        this.props.getGibber(this.props.gibberId)
    }

    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath)
        this.setState({ open: false })
        this.props.clearErrors()
    }

    render() {
        
        const { 
            classes, 
            gibber: { 
                gibberId, 
                body, 
                createdAt, 
                likeCount, 
                commentCount, 
                userImage, 
                userHandle,
                comments
            }, ui: { 
                loading 
            }
        } = this.props

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2} />
            </div>
        ) : (
            <Grid container>
                <Grid item sm={5}>
                    <img src={userImage} alt="Profile" className={classes.profileImage} />
                </Grid>
                <Grid item sm={7}>
                    <Typography
                        component={Link}
                        color="primary"
                        variant="h5"
                        to={`/user/${userHandle}`}
                    >
                        @{userHandle}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    <LikeButton gibberId={gibberId} />
                    <span>{likeCount ? likeCount : 0} likes</span>
                    <CustomIconButton tip="comments">
                        <Chat color="primary" />
                    </CustomIconButton>
                    <span>{commentCount ? commentCount : 0} comments</span>
                </Grid>
                <hr className={classes.visibleSeparator} />
                <CommentForm gibberId={gibberId} />
                <Comments comments={comments} />
            </Grid>
        )

        return (
            <Fragment>
                <CustomIconButton onClick={this.handleOpen} tip="Expand gibber" tipClassName={classes.expandButton}>
                    <UnfoldMore color="primary" />
                </CustomIconButton>
                <Dialog                    
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <CustomIconButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <Close />
                    </CustomIconButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }

}

const mapStateToProps = (state) => ({
    gibber: state.data.gibber,
    ui: state.ui
})

const mapActionsToProps = {
    getGibber,
    clearErrors
}

GibberDialog.propTypes = {
    getGibber: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    gibberId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    gibber: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(GibberDialog))