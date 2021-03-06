import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'

// Material UI 
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

// Redux
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Home } from '@material-ui/icons';

import CustomIconButton from '../../utils/CustomIconButton';
import PostGibber from '../gibber/PostGibber'
import Notifications from './Notifications'

class Navbar extends Component {
    render() {

        const { authenticated } = this.props

        return (
            <div>
                <AppBar>
                    <Toolbar className='nav-container'>
                        { authenticated ? (
                            <Fragment>
                                <PostGibber />
                                <Link to="/">
                                    <CustomIconButton tip="Home">
                                        <Home />
                                    </CustomIconButton>
                                </Link>
                                <Notifications />
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Button color='inherit' component={Link} to='/login'>Login</Button>
                                <Button color='inherit' component={Link} to='/'>Home</Button>
                                <Button color='inherit' component={Link} to='/signup'>Signup</Button>
                            </Fragment>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
})

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(Navbar)
