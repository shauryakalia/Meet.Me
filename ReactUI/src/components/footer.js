import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Divider, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing.unit * 8,
        backgroundColor: theme.palette.background.default,
        textAlign: "center",
    },
    footer: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    text: {
        color: theme.palette.common.grey,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    }
}));

export default function Footer() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Divider />
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                className={classes.footer}
            >
                <Typography variant="caption" className={classes.text}>
                    Help
                </Typography>
                <Typography variant="caption" className={classes.text}>
                    Status
                </Typography>
                <Typography variant="caption" className={classes.text}>
                    Writers
                </Typography>
                <Typography variant="caption" className={classes.text}>
                    Blog
                </Typography>
                <Typography variant="caption" className={classes.text}>
                    Careers
                </Typography>
                <Typography variant="caption" className={classes.text}>
                    Privacy
                </Typography>
                <Typography variant="caption" className={classes.text}>
                    Terms
                </Typography>
                <Typography variant="caption" className={classes.text}>
                    About
                </Typography>
            </Grid>
        </div>
    );
}
