import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { deleteScream } from './../redux/actions/data-actions'
import CustomIconButton from '../utils/CustomIconButton';
import { DeleteOutline } from '@material-ui/icons';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';

const styles = {
    deleteButton: {
        position: 'absolute',
        left: '90%',
        top: '10%'
    }
}

class DeleteScream extends Component {

    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    deleteScream = () => {
        this.props.deleteScream(this.props.screamId)
        this.setState({ open: false })
    }

    render() {

        const { classes } = this.props

        return (
            <Fragment>
                <CustomIconButton 
                    tip="Delete Scream" 
                    onClick={this.handleOpen} 
                    btnClassName={classes.deleteButton}
                >
                    <DeleteOutline color="secondary" />
                </CustomIconButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        Are you sure you want to delete this scream?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteScream} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

const mapStateToProps = null

const mapActionToProps = {
    deleteScream
}

DeleteScream.propTypes = {
    deleteScream: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DeleteScream))
