import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Divider, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        textAlign: "center",
    },
    footer: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    text: {
        color: theme.palette.common.grey,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
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
                    Copyright@2019, All rights reserved
                </Typography>
            </Grid>
        </div>
    );
}
