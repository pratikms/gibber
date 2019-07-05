import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Gibber from '../components/gibber/Gibber'
import StaticProfile from '../components/profile/StaticProfile'

import GibberSkeleton from '../utils/GibberSkeleton'
import ProfileSkeleton from '../utils/ProfileSkeleton'

import { connect } from 'react-redux'
import { getUserData } from '../redux/actions/data-actions'
import { Grid } from '@material-ui/core';

class User extends Component {

    state = {
        profile: null,
        gibberIdParam: null
    }

    componentDidMount() {
        const handle = this.props.match.params.handle
        const gibberId = this.props.match.params.gibberId

        if (gibberId) this.setState({ gibberIdParam: gibberId })

        this.props.getUserData(handle)
        axios.get(`/user/${handle}`)
            .then(res => {
                this.setState({
                    profile: res.data.user
                })
            })
            .catch(err => console.log(err))
    }

    render() {

        const { gibbers, loading } = this.props.data
        const { gibberIdParam } = this.state

        const gibbersMarkup = loading ? (
            <GibberSkeleton />
        ) : gibbers === null ? (
            <p>No gibbers yet</p>
        ) : !gibberIdParam ? (
            gibbers.map(gibber => <Gibber key={gibber.gibberId} gibber={gibber} />)
        ) : (
            gibbers.map(gibber => {
                if (gibber.gibberId !== gibberIdParam) return <Gibber key={gibber.gibberId} gibber={gibber} />
                else return <Gibber key={gibber.gibberId} gibber={gibber} openDialog />
            })
        )

        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12}>
                    { gibbersMarkup }
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile === null ? (
                        <ProfileSkeleton />
                    ) : (
                        <StaticProfile profile={this.state.profile} />
                    )}
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.data
})

const mapActionToProps = {
    getUserData
}

User.protoTypes = {
    getUserData: PropTypes.func.isRequired,
    data: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapActionToProps)(User)
