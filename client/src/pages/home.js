import React, { Component } from 'react'
import { Grid } from '@material-ui/core';

import Gibber from '../components/gibber/Gibber'
import Profile from '../components/profile/Profile'
import GibberSkeleton from '../utils/GibberSkeleton'

import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { getGibbers } from '../redux/actions/data-actions'

class Home extends Component {

    componentDidMount() {
        this.props.getGibbers()
    }

    render() {

        const { gibbers, loading } = this.props.data

        let recentGibbersMarkup = !loading ?
            gibbers.map(gibber => <Gibber key={gibber.gibberId} gibber={gibber} />) : 
            <GibberSkeleton />

        return (
            <Grid container spacing={2}>
                <Grid item sm={8} xs={12}>
                    { recentGibbersMarkup }
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile />
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.data
})

const mapActionToProps = {
    getGibbers
}

Home.propTypes = {
    getGibbers: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapActionToProps)(Home)
