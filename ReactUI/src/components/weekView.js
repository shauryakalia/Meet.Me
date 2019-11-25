import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Paper, Button, Typography
} from '@material-ui/core';


const timingSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '12:30 PM', '1:00 PM', '1:30 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
    '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'];

const weekDays = [0, 1, 2, 3, 4, 5, 6];


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    timeButton: {
        padding: theme.spacing(2),
        minWidth: '94px',
        minHeight: '82px',
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
    },
    bookingButton: {
        backgroundColor: 'blue'
    },
    slotButton: {
        backgroundColor: 'green'
    }
}));

export default function WeekView(props) {
    const { slots, bookings } = props;
    const classes = useStyles();
    const [currentDate] = React.useState(new Date());

    const checkSlot = (index, time) => {
        let selectedDate = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getDate();
        for (let i = 0; i < bookings.length; i++) {
            let bookingTime = new Date(bookings[i].startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if (new Date(bookings[i].startDate).getDate() === selectedDate && bookingTime === time)
                return 'booking';
        }
        for (let i = 0; i < slots.length; i++) {
            let slotTime = new Date(slots[i].startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if (new Date(slots[i].startDate).getDate() === selectedDate && slotTime === time)
                return 'slot';
        }
        return false;
    }

    return (
        <Paper>
            <Grid container >
                <Grid item xs>
                    <Button disabled variant="outlined" className={classes.blankButton}></Button>
                </Grid>
                {weekDays.map(index => (
                    <Grid key={index} item xs className={classes.dateGrid}>
                        <Typography>{new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[0]}</Typography>
                        <Typography>{new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getDate()}</Typography>
                    </Grid>
                ))}
            </Grid>
            {timingSlots.map(time => (
                <Grid container key={time} >
                    <Grid item xs>
                        <Button disabled variant="outlined" className={classes.timeButton}>{time}</Button>
                    </Grid>
                    {weekDays.map(index => (
                        <Grid key={index} item xs>
                            {checkSlot(index, time) === 'booking' &&
                                <Button variant="contained" style={{backgroundColor: 'blue'}} className={classes.button} ></Button>
                            }
                            {checkSlot(index, time) === 'slot' &&
                            <Button variant="contained" style={{backgroundColor: 'green'}} className={classes.button} ></Button>
                            }
                            {!checkSlot(index, time) &&
                            <Button variant="outlined" className={classes.button} ></Button>
                            }
                        </Grid>
                    ))}
                </Grid>
            ))}
        </Paper>
    );
}