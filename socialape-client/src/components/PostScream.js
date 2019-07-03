import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'

import { connect } from 'react-redux'
import { postScream, clearErrors } from '../redux/actions/data-actions'

// Icons
import { Dialog, DialogTitle, DialogContent, TextField, CircularProgress, Button } from '@material-ui/core';
import theme from '../utils/theme';
import CustomIconButton from '../utils/CustomIconButton';
import { Add, Close } from '@material-ui/icons';

const styles = {
    ...theme,
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 10
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '90%',
        top: '5%'
    }
}

class PostScream extends Component {

    state = {
        open: false,
        body: '',
        errors: {}
    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.props.clearErrors()
        this.setState({ open: false, errors: {} })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        console.log(this.state)
        this.props.postScream({ body: this.state.body })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.ui.errors) {
            this.setState({
                errors: nextProps.ui.errors
            })
        }
        if (!nextProps.ui.errors && !nextProps.ui.loading) {
            this.setState({ body: '', open: false, errors: {} })
        }
    }

    render() {

        const { errors } = this.state

        const { classes, ui: { loading }} = this.props

        return (
            <Fragment>
                <CustomIconButton onClick={this.handleOpen} tip="Scream!">
                    <Add />
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
                    <DialogTitle>Post a new scream</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="body"
                                type="text"
                                label="Screeaam!!"
                                multiline
                                rows="3"
                                error={errors.body ? true : false}
                                helperText={errors.body}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <Button 
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.submitButton}
                                disabled={loading}
                            >
                                Submit
                                {loading && (
                                    <CircularProgress size={30} className={classes.progressSpinner} />
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }

}

const mapStateToProps = (state) => ({
    ui: state.ui
})

const mapActionToProps = {
    postScream,
    clearErrors
}

PostScream.propTypes = {
    postScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(PostScream))