import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Paper, Button, Typography
} from '@material-ui/core';
import BackendService from '../services/backendServices';

const timingSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '12:30 PM', '01:00 PM', '01:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'];

const weekDays = [0, 1, 2, 3, 4, 5, 6];


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    timeButton: {
        padding: theme.spacing(2),
        borderRadius: 0,
    },
    dateGrid: {
        border: '1px solid',
        borderColor: theme.palette.primary.light,
        color: theme.palette.primary.dark,
        padding: theme.spacing(1)
    },
    blankButton: {
        padding: theme.spacing(4),
        minWidth: '94px',
        minHeight: '74px',
        borderRadius: 0,
    },
    button: {
        padding: theme.spacing(4),
        minWidth: '111px',
        minHeight: '82px',
        borderRadius: 0,
    }
}));

export default function WeekView() {
    const classes = useStyles();
    const [currentDate] = React.useState(new Date());

    return (
        <Paper>
            <Grid container >
                <Grid item xs>
                    <Button disabled variant="outlined" className={classes.blankButton}></Button>
                </Grid>
                {weekDays.map(index => (
                    <Grid item xs className={classes.dateGrid}>
                        <Typography>{new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[0]}</Typography>
                        <Typography>{new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getDate()}</Typography>
                    </Grid>
                ))}
                {/* <Grid item xs className={classes.dateGrid}>
                    <Typography>Sun</Typography>
                    <Typography>{currentDate.getDate() + 1}</Typography>
                </Grid> */}
                {/* <Grid item xs className={classes.dateGrid}>
                    <Typography>Sun</Typography>
                    <Typography>{currentDate.getDate() + 2}</Typography>
                </Grid>
                <Grid item xs className={classes.dateGrid}>
                    <Typography>Sun</Typography>
                    <Typography>{currentDate.getDate() + 3}</Typography>
                </Grid>
                <Grid item xs className={classes.dateGrid}>
                    <Typography>Sun</Typography>
                    <Typography>{currentDate.getDate() + 1}</Typography>
                </Grid>
                <Grid item xs className={classes.dateGrid}>
                    <Typography>Sun</Typography>
                    <Typography>24</Typography>
                </Grid>
                <Grid item xs className={classes.dateGrid}>
                    <Typography>Sun</Typography>
                    <Typography>24</Typography>
                </Grid> */}
            </Grid>
            {timingSlots.map(slot => (
                <Grid container >
                    <Grid item xs>
                        <Button disabled variant="outlined" className={classes.timeButton}>{slot}</Button>
                    </Grid>
                    <Grid item xs>
                        <Button variant="outlined" className={classes.button}></Button>
                    </Grid>
                    <Grid item xs>
                        <Button variant="outlined" className={classes.button}></Button>
                    </Grid>
                    <Grid item xs>
                        <Button variant="outlined" className={classes.button}></Button>
                    </Grid>
                    <Grid item xs>
                        <Button variant="outlined" className={classes.button}></Button>
                    </Grid>
                    <Grid item xs>
                        <Button variant="outlined" className={classes.button}></Button>
                    </Grid>
                    <Grid item xs>
                        <Button variant="outlined" className={classes.button}></Button>
                    </Grid>
                    <Grid item xs>
                        <Button variant="outlined" className={classes.button}></Button>
                    </Grid>
                </Grid>
            ))}
        </Paper>
    );
}