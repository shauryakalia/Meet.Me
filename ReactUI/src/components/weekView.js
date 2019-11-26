import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Paper, Button, Typography, Tooltip, Popover
} from '@material-ui/core';
import BackendService from '../services/backendServices';


const timingSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
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
        padding: theme.spacing(1),
        minWidth: '111px',
        minHeight: '82px',
        fontSize: 12,
        borderRadius: 0,
    },
    popoverButton: {
        margin: theme.spacing(1),
    },
}));

export default function WeekView(props) {
    const { slots, bookings } = props;
    const classes = useStyles();
    const [currentDate] = React.useState(new Date());
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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

    const addSlot = async (index, time) => {
        let selectedDate = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000));
        let hour = time.split(':')[0];
        if (time.split(':')[1].split(' ')[1] === 'PM' && hour < 12) {
            hour = parseInt(hour) + 12;
        }
        let minute = time.split(':')[1].split(' ')[0];
        const fromTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, minute, 0, 0).getTime();
        const practiceId = localStorage.getItem('userId');
        const serviceId = localStorage.getItem('serviceId');
        let response = await BackendService.addSlot({
            practiceId,
            serviceId,
            fromTime: fromTime
        });
        if (response.data.status) {
            alert('Slot added!');
        } else {
            alert("Something went wrong");
        }
    }

    const deleteSlot = async (index, time) => {
        let selectedDate = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000));
        let hour = time.split(':')[0];
        if (time.split(':')[1].split(' ')[1] === 'PM' && hour < 12) {
            hour = parseInt(hour) + 12;
        }
        let minute = time.split(':')[1].split(' ')[0];
        const fromTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, minute, 0, 0).getTime();
        for (let i = 0; i < slots.length; i++) {
            let slotTime = new Date(slots[i].startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if (selectedDate.getDate() === new Date(slots[i].startDate).getDate() && slotTime === time) {
                console.log("Delete", new Date(slots[i].startDate).getDate());
                console.log("Delete", selectedDate);
                console.log("Delete", slotTime);
                console.log("Delete", index);
                console.log("Delete", fromTime);
                // const practiceId = localStorage.getItem('userId');
                // let response = await BackendService.deleteSlot({
                //     practiceId,
                //     slotId: slots[i].slotId,
                //     fromTime: new Date(slots[i].startDate).getTime()
                // });
                // if (response.data.status) {
                //     setAnchorEl(null);
                //     alert('Slot removed')
                // } else {
                //     alert("Something went wrong");
                // }
            }
        }
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
                            {checkSlot(index, time) === 'slot' &&
                                <div>
                                    <Button variant="outlined" style={{ color: 'blue', borderColor: 'blue' }}
                                        className={classes.button} onClick={handleClick}>Available</Button>
                                    <Popover
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            style={{ color: 'green', borderColor: 'green' }}
                                            className={classes.popoverButton}
                                        >
                                            Add Booking
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            className={classes.popoverButton}
                                            onClick={() => deleteSlot(index, time)}
                                            style={{ color: 'red', borderColor: 'red' }}
                                        >
                                            Delete Slot
                                        </Button>
                                    </Popover>
                                </div>
                            }
                            {checkSlot(index, time) === 'booking' &&
                                <Button variant="outlined" style={{ color: 'green', borderColor: 'green' }}
                                    className={classes.button}>Booked</Button>
                            }
                            {!checkSlot(index, time) &&
                                // <Button variant="outlined" className={classes.button} 
                                // onMouseEnter={onMouseOver(index)} onMouseLeave={onMouseOut}>{hoverIndex === index ? 'Add Slot': ''}</Button>
                                <Tooltip title="Add Slot" arrow>
                                    <Button variant="outlined" className={classes.button} onClick={() => addSlot(index, time)}></Button>
                                </Tooltip>
                            }
                        </Grid>
                    ))}
                </Grid>
            ))}
        </Paper>
    );
}