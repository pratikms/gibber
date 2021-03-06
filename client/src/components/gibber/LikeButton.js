import React, { Component } from 'react'
import CustomIconButton from '../../utils/CustomIconButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { FavoriteBorder, Favorite } from '@material-ui/icons';

import { connect } from 'react-redux'
import { likeGibber, unlikeGibber } from '../../redux/actions/data-actions'

class LikeButton extends Component {
    
    likedGibber = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.gibberId === this.props.gibberId)) {
            return true
        }
        return false
    }

    likeGibber = () => {
        this.props.likeGibber(this.props.gibberId)
    }

    unlikeGibber = () => {
        this.props.unlikeGibber(this.props.gibberId)
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
            this.likedGibber() ? (
                <CustomIconButton tip="Unlike" onClick={this.unlikeGibber}>
                    <Favorite color="primary" />
                </CustomIconButton>
            ) : (
                <CustomIconButton tip="Like" onClick={this.likeGibber}>
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
    likeGibber,
    unlikeGibber
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    gibberId: PropTypes.string.isRequired,
    likeGibber: PropTypes.func.isRequired,
    unlikeGibber: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)
