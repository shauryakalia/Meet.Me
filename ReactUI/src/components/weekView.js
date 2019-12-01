import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Paper, Button, Typography, Tooltip, Popover, IconButton,
    Dialog, DialogActions, DialogContent, TextField, DialogTitle
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import BackendService from '../services/backendServices';


const timingSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
    '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'];

const weekDays = [0, 1, 2, 3, 4, 5, 6];


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    rootModal: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
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
    const { slots, bookings, timings } = props;
    const classes = useStyles();
    const [currentDate] = React.useState(new Date());
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [data, setData] = React.useState({});
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [bookingData, setBookingData] = React.useState({
        email: undefined,
        name: undefined,
        mobile: undefined,
        notes: undefined,
    });
    const [bookedOpen, setBookedOpen] = React.useState(false);
    const [bookingDetails, setBookingDetails] = React.useState({});

    const handleBookedOpen = async (index, time) => {
        let selectedDate = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000));
        for (let i = 0; i < bookings.length; i++) {
            let slotTime = new Date(bookings[i].startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if (selectedDate.getDate() === new Date(bookings[i].startDate).getDate() && slotTime === time) {
                setBookingDetails(bookings[i]);
                setBookedOpen(true);
            }
        }
    };
    const handleBookedClosed = () => {
        setBookedOpen(false);
    };

    const openBookingDialog = (data) => {
        setDialogOpen(true);
    };

    const closeBookingDialog = () => {
        setDialogOpen(false);
    };


    const handleClick = (event, index, time) => {
        setData({ index, time });
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const textChange = prop => event => {
        setBookingData({ ...bookingData, [prop]: event.target.value });
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const checkSlot = (index, time) => {
        let selectedDate = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getDate();
        const selectedDay = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[0];
        for (let i = 0; i < timings.length; i++) {
            if (selectedDay.toLowerCase() === timings[i].day.slice(0, 3)) {
                return 'closed';
            }
        }
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
            window.location.reload(false);
            alert('Slot added!');
        } else {
            alert("Something went wrong");
        }
    }

    const deleteSlot = async () => {
        let selectedDate = new Date(currentDate.getTime() + (data.index * 24 * 60 * 60 * 1000));
        for (let i = 0; i < slots.length; i++) {
            let slotTime = new Date(slots[i].startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if (selectedDate.getDate() === new Date(slots[i].startDate).getDate() && slotTime === data.time) {
                const practiceId = localStorage.getItem('userId');
                let response = await BackendService.deleteSlot({
                    practiceId,
                    slotId: slots[i].slotId,
                    fromTime: new Date(slots[i].startDate).getTime()
                });
                if (response.data.status) {
                    setAnchorEl(null);
                    setData({});
                    window.location.reload(false);
                    alert('Slot removed')
                } else {
                    alert("Something went wrong");
                }
            }
        }
    }

    const addBooking = async () => {
        let selectedDate = new Date(currentDate.getTime() + (data.index * 24 * 60 * 60 * 1000));
        for (let i = 0; i < slots.length; i++) {
            let slotTime = new Date(slots[i].startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if (selectedDate.getDate() === new Date(slots[i].startDate).getDate() && slotTime === data.time) {
                const practiceId = parseInt(localStorage.getItem('userId'));
                const serviceId = parseInt(localStorage.getItem('serviceId'));
                let response = await BackendService.addBooking({
                    practiceId,
                    serviceId,
                    firstName: bookingData.name,
                    email: bookingData.email,
                    mobileNumber: bookingData.mobile,
                    additionalNotes: bookingData.notes !== undefined ? bookingData.notes : 'NA',
                    slotId: slots[i].slotId,
                    fromTime: new Date(slots[i].startDate).getTime()
                });
                if (response.data.status) {
                    setAnchorEl(null);
                    setBookingData({
                        email: undefined,
                        name: undefined,
                        notes: undefined,
                        mobile: undefined
                    })
                    setData({});
                    window.location.reload(false);
                    alert('Booking Confirmed')
                } else {
                    alert("Something went wrong");
                }
            }
        }
    }

    const cancelBooking = async () => {
        const practiceId = parseInt(localStorage.getItem('userId'));
        let response = await BackendService.cancelBooking({
            practiceId,
            slotId: bookingDetails.slotId,
            bookingId: bookingDetails.bookingId
        });
        if (response.data.status) {
            window.location.reload(false);
            this.handleBookedClosed();
            alert("Booking Cancelled");
        } else {
            alert("Something went wrong");
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
                        <Typography>{`${new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getDate()} ${new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[1]}`}</Typography>
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
                                        className={classes.button} onClick={(e) => handleClick(e, index, time)}>Available</Button>
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
                                            onClick={() => openBookingDialog(data)}
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
                                    <Dialog open={dialogOpen} onClose={closeBookingDialog} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="form-dialog-title">Book an Appointment</DialogTitle>
                                        <DialogContent>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                required
                                                id="name"
                                                label="Name"
                                                type="text"
                                                value={bookingData.name}
                                                onChange={textChange('name')}
                                                fullWidth
                                            />
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="email"
                                                label="Email Address"
                                                type="email"
                                                required
                                                value={bookingData.email}
                                                onChange={textChange('email')}
                                                fullWidth
                                            />
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="mobile"
                                                label="Mobile"
                                                value={bookingData.mobile}
                                                onChange={textChange('mobile')}
                                                type="digit"
                                                required
                                                fullWidth
                                            />
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="notes"
                                                label="Additional Notes"
                                                type="text"
                                                value={bookingData.notes}
                                                onChange={textChange('notes')}
                                                fullWidth
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={closeBookingDialog} color="secondary">
                                                Cancel
                                            </Button>
                                            <Button onClick={addBooking} color="secondary"
                                                disabled={bookingData.email === undefined || bookingData.name === undefined
                                                    || bookingData.mobile === undefined}>
                                                Submit
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            }
                            {checkSlot(index, time) === 'booking' &&
                                <div>
                                    <Button variant="outlined" style={{ color: 'green', borderColor: 'green' }}
                                        className={classes.button} onClick={() => handleBookedOpen(index, time)}>Booked</Button>
                                    <Dialog onClose={handleBookedClosed} aria-labelledby="customized-dialog-title" open={bookedOpen}>
                                        <DialogTitle disableTypography className={classes.rootModal} >
                                            <Typography variant="h6">Booking Details</Typography>
                                            <IconButton aria-label="close" className={classes.closeButton} onClick={handleBookedClosed}>
                                                <CloseIcon />
                                            </IconButton>
                                        </DialogTitle>
                                        <DialogContent dividers>
                                            <Typography gutterBottom>
                                                Name: {bookingDetails.firstName}
                                            </Typography>
                                            <Typography gutterBottom>
                                                Email: {bookingDetails.email}
                                            </Typography>
                                            <Typography gutterBottom>
                                                Mobile: {bookingDetails.mobileNumber}
                                            </Typography>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button autoFocus onClick={() => cancelBooking()} color="primary">
                                                Cancel Booking
                                      </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            }
                            {checkSlot(index, time) === 'closed' &&
                                <Tooltip title="Add Slot" arrow>
                                    <Button variant="outlined" className={classes.button} disabled={true}>Closed</Button>
                                </Tooltip>
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