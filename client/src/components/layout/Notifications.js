import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { markNotificationsRead } from '../../redux/actions/user-actions'
import { Badge, Tooltip, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { Notifications as NotificationsIcon, Favorite, Chat } from '@material-ui/icons'

class Notifications extends Component {
    
    state = {
        anchorEl: null
    }

    handleOpen = (event) => {
        this.setState({ anchorEl: event.target })
    }

    handleClose = () => {
        this.setState({ anchorEl: null })
    }

    onMenuOpened = () => {
        let unreadNotificationsIds = this.props.notifications
            .filter(notification => !notification.read)
            .map(notification => notification.notificationId)
        this.props.markNotificationsRead(unreadNotificationsIds)
    }

    render() {
        const notifications = this.props.notifications
        const anchorEl = this.state.anchorEl

        let notificationsIcon
        if (notifications && notifications.length > 0) {
            notifications.filter(notification => notification.read === false).length > 0 ?
                notificationsIcon = (
                    <Badge badgeContent={notifications.filter(notification => notification.read === false).length} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                ) : (
                    notificationsIcon = <NotificationsIcon />
                )
        } else {
            notificationsIcon = <NotificationsIcon />
        }

        let notificationsMarkup = notifications && notifications.length > 0 ?
            (
                notifications.map(notification => {
                    const verb = notification.type === 'like' ? 'liked': 'commented on'
                    const time = dayjs(notification.createdAt).fromNow()
                    const iconColor = notification.read ? 'primary' : 'secondary'
                    const icon = notification.type === 'like' ? (
                        <Favorite color={iconColor} style={{ marginRight: 10 }} />
                    ) : (
                        <Chat color={iconColor} style={{ marginRight: 10 }} />
                    )

                    return (
                        <MenuItem key={notification.createdAt} onClick={this.handleClose}>
                            {icon}
                            <Typography
                                component={Link}
                                color="default"
                                variant="body1"
                                to={`/users/${notification.recipient}/gibber/${notification.gibberId}`}
                            >
                                {notification.sender} {verb} your gibber {time}
                            </Typography>
                        </MenuItem>
                    )
                })
            ) : (
                <MenuItem onClick={this.handleClose}>
                    You have no notifications yet
                </MenuItem>
            ) 

        return (
            <Fragment>
                <Tooltip title="Notifications">
                    <IconButton 
                        aria-owns={anchorEl ? 'simple-menu' : undefined} 
                        aria-haspopup="true"
                        onClick={this.handleOpen}
                    >
                        {notificationsIcon}
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    onEntered={this.onMenuOpened}
                >
                    {notificationsMarkup}
                </Menu>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    notifications: state.user.notifications
})

const mapActionToProps = {
    markNotificationsRead
}

Notifications.propTypes = {
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired
}

export default connect(mapStateToProps, mapActionToProps)(Notifications)