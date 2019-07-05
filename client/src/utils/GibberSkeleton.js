import React, { Fragment } from 'react'
import NoImg from '../images/no-img.png'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import theme from './theme';
import { Card, CardMedia, CardContent } from '@material-ui/core';

const styles = {
    ...theme
}

const GibberSkeleton = (props) => {

    const { classes } = props

    const content = Array.from({ length: 5 }).map((item, index) => (
        <Card className={classes.card} key={index}>
            <CardMedia className={classes.cover} image={NoImg} />
            <CardContent className={classes.cardContent}>
                <div className={classes.handle} />
                <div className={classes.date} />
                <div className={classes.fullLine} />
                <div className={classes.fullLine} />
                <div className={classes.halfLine} />
            </CardContent>
        </Card>
    ))

    return <Fragment>{content}</Fragment>
}

GibberSkeleton.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(GibberSkeleton)