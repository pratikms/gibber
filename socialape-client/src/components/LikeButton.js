import React, { Component } from 'react'
import CustomIconButton from '../utils/CustomIconButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { FavoriteBorder, Favorite } from '@material-ui/icons';

import { connect } from 'react-redux'
import { likeScream, unlikeScream } from '../redux/actions/data-actions'

class LikeButton extends Component {
    
    likedScream = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.screamId === this.props.screamId)) {
            return true
        }
        return false
    }

    likeScream = () => {
        this.props.likeScream(this.props.screamId)
    }

    unlikeScream = () => {
        this.props.unlikeScream(this.props.screamId)
    }

    render() {

        const { authenticated } = this.props.user

        const likeButton = !authenticated ? (
            <Link to="/login">
                <CustomIconButton tip="Like">
                    <FavoriteBorder color="primary" />
                </CustomIconButton>
            </Link>
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

        return likeButton
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    likeScream,
    unlikeScream
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)
