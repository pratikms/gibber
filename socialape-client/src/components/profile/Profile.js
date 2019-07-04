import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import EditDetails from './EditDetails'
import ProfileSkeleton from '../../utils/ProfileSkeleton'

// Material UI
import { Button, Paper, Link as MUILink, Typography } from '@material-ui/core'

// Icons
import { LocationOn, CalendarToday, KeyboardReturn } from '@material-ui/icons'
import LinkIcon from '@material-ui/icons/Link'
import EditIcon from '@material-ui/icons/Edit'

import { logoutUser, uploadImage } from '../../redux/actions/user-actions'
import CustomIconButton from '../../utils/CustomIconButton';
import theme from '../../utils/theme';

const styles = {
    ...theme
}

class Profile extends Component {

    handleImageChange = (event) => {
        const image = event.target.files[0]
        const formData = new FormData()
        formData.append('image', image, image.name)
        this.props.uploadImage(formData)
    }

    handleEditPicture = () => {
        const fileInput = document.getElementById('profileImage')
        fileInput.click()
    }

    handleLogout = () => {
        this.props.logoutUser()
    }

    render() {

        const { 
            classes, 
            user: { 
                credentials: { 
                    handle, 
                    createdAt, 
                    imageUrl, 
                    bio, 
                    website, 
                    location
                },
                authenticated,
                loading 
            }, 
        } = this.props

        let profileMarkup = !loading ? (authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img className="profile-image" src={imageUrl} alt="profile" />
                        <input type="file" id="profileImage" onChange={this.handleImageChange} hidden="hidden" />
                        <CustomIconButton tip="Change profile picture" onClick={this.handleEditPicture} btnClassName="button">
                            <EditIcon color="primary" />
                        </CustomIconButton>
                    </div>
                    <hr />
                    <div className="profile-details">
                        <MUILink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
                            @{handle}
                        </MUILink>
                        <hr />
                        {bio && <Typography variant="body2">{bio}</Typography>}
                        <hr />
                        {location && (
                            <Fragment>
                                <LocationOn color="primary" /><span>{location}</span>
                                <hr />
                            </Fragment>
                        )}
                        {website && (
                            <Fragment>
                                <LinkIcon color="primary" />
                                <a href={website} target="_blank" rel="noopener noreferrer">
                                    {' '}{website}
                                </a>
                                <hr />
                            </Fragment>
                        )}
                        <CalendarToday color="primary" />{' '}
                        <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    </div>
                    <CustomIconButton tip="Logout" onClick={this.handleLogout}>
                        <KeyboardReturn color="primary" />
                    </CustomIconButton>
                    <EditDetails />
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant="body2" align="center">
                    No profile found. Please login again
                </Typography>
                <div className={classes.buttons}>
                    <Button variant="contained" color="primary" component={Link} to='/login'>
                        Log In
                    </Button>
                    <Button variant="contained" color="secondary" component={Link} to='/signup'>
                        Sign Up
                    </Button>
                </div>
            </Paper>
        )) : (
            <ProfileSkeleton />
        )

        return profileMarkup
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    logoutUser,
    uploadImage
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile))
