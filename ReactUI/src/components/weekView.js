import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Paper, Button, Typography, Tooltip, Popover, IconButton, CssBaseline,
    Dialog, DialogActions, DialogContent, TextField, DialogTitle, Snackbar
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import CloseIcon from '@material-ui/icons/Close';
import BackendService from '../services/backendServices';


const timingSlots = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'];

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
    staticGrid: {
        border: '1px solid',
        borderColor: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        paddingTop: '15px',
        textAlign: 'center',
    },
    grid: {
        border: '1px solid',
        borderColor: theme.palette.primary.light,
        color: theme.palette.primary.dark,
        height: '80px',
    },
    button: {
        fontSize: 12,
        width: '100%',
        height: '80px',
        border: 'none',
    },
    popoverButton: {
        margin: theme.spacing(1),
    },
}));

export default function WeekView(props) {
    const { serviceId, timings, slot, booking } = props;
    const classes = useStyles();
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [data, setData] = React.useState({});
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [mobile, setMobile] = React.useState('');
    const [name, setName] = React.useState('');
    const [notes, setNotes] = React.useState('');
    const [bookedOpen, setBookedOpen] = React.useState(false);
    const [bookingDetails, setBookingDetails] = React.useState({});
    const [slots, setSlots] = React.useState([]);
    const [bookings, setBookings] = React.useState([]);
    const [state, setState] = React.useState({
        snackOpen: false,
        message: '',
        vertical: 'top',
        horizontal: 'right',
    });

    const { vertical, horizontal, snackOpen, message } = state;

    const handleSnackClose = () => {
        setState({ ...state, snackOpen: false });
    };

    React.useEffect(() => {
        setSlots(slot);
        setBookings(booking);
    }, [props]);

    const getCalenderDetails = async () => {
        try {
            const practiceId = localStorage.getItem('userId');
            const service = serviceId;
            if (practiceId) {
                if (service) {
                    let response = await BackendService.getCalendarSlots({
                        practiceId: practiceId,
                        serviceId: service
                    });
                    let res = await BackendService.getCalendarBookings({
                        practiceId: practiceId,
                        serviceId: service
                    });
                    setBookings(res.data.data);
                    setSlots(response.data.data);
                }
            } else {
                window.location.pathname = '/signin';
            }
        } catch (error) {
            setState({ ...state, snackOpen: true, message: 'Something went wrong!' });
        }
    }

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

    const handleDateChange = date => {
        setCurrentDate(date);
    };

    const handleBookedClosed = () => {
        setBookedOpen(false);
    };

    const openBookingDialog = () => {
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

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const checkSlot = (index, time) => {
        let selectedDate = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getDate();
        let selectedMonth = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getMonth();
        let selectedYear = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getFullYear();
        const selectedDay = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[0];
        for (let i = 0; i < timings.length; i++) {
            if (selectedDay.toLowerCase() === timings[i].day.slice(0, 3)) {
                const selectedTime = time.split(" ");
                if (timings[i].closed) {
                    return 'closed';
                } else if (selectedTime[1] === 'AM') {
                    const timeIndex = (timings[i].from.split(" ")[0]).split(":");
                    if (selectedTime[0].split(':')[0] < timeIndex[0] ||
                        (selectedTime[0].split(':')[0] === timeIndex[0] && selectedTime[0].split(':')[1] < timeIndex[1]))
                        return 'closed';
                } else if (selectedTime[1] === 'PM') {
                    const timeIndex = (timings[i].to.split(" ")[0]).split(":");
                    const hourFormat = parseInt(timeIndex[0]) - 12;
                    if (parseInt(selectedTime[0].split(':')[0]) !== 12) {
                        if (selectedTime[0].split(':')[0] > hourFormat ||
                            (selectedTime[0].split(':')[0] === hourFormat && selectedTime[0].split(':')[1] > timeIndex[1]))
                            return 'closed';
                    }
                }
            }
        }
        for (let i = 0; i < bookings.length; i++) {
            let bookingTime = new Date(bookings[i].startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            bookingTime = bookingTime.length === 7 ? '0' + bookingTime : bookingTime;
            if (new Date(bookings[i].startDate).getDate() === selectedDate && new Date(bookings[i].startDate).getMonth() === selectedMonth && new Date(bookings[i].startDate).getFullYear() === selectedYear && bookingTime === time) {
                return { status: 'booking', index: i };
            }
        }
        for (let i = 0; i < slots.length; i++) {
            let slotTime = new Date(slots[i].startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            slotTime = slotTime.length === 7 ? '0' + slotTime : slotTime;
            if (new Date(slots[i].startDate).getDate() === selectedDate && new Date(slots[i].startDate).getMonth() === selectedMonth && new Date(slots[i].startDate).getFullYear() === selectedYear && slotTime === time) {
                return 'slot';
            }
        }
        return false;
    }

    const addSlot = async (index, time) => {
        try {
            let selectedDate = new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000));
            let hour = time.split(':')[0];
            if (time.split(':')[1].split(' ')[1] === 'PM' && hour < 12) {
                hour = parseInt(hour) + 12;
            }
            let minute = time.split(':')[1].split(' ')[0];
            let monthCheck = selectedDate.getMonth() + 1;
            let fromTime = `${selectedDate.getFullYear()}-${monthCheck < 10 ? '0'+ monthCheck : monthCheck }-${selectedDate.getDate() < 10 ? '0' + selectedDate.getDate() : selectedDate.getDate()}T${hour}:${minute}:00.000Z`
            const practiceId = localStorage.getItem('userId');
            const service = parseInt(serviceId);
            let response = await BackendService.addSlot({
                practiceId,
                serviceId: service,
                fromTime: fromTime
            });
            if (response.data.status) {
                getCalenderDetails()
                setState({ ...state, snackOpen: true, message: 'Slot added!' });
            } else {
                setState({ ...state, snackOpen: true, message: 'Something went wrong!' });
            }
        } catch (error) {
            setState({ ...state, snackOpen: true, message: 'Something went wrong!' });
        }
    }

    const deleteSlot = async () => {
        let selectedDate = new Date(currentDate.getTime() + (data.index * 24 * 60 * 60 * 1000));
        for (let i = 0; i < slots.length; i++) {
            let slotTime = new Date(slots[i].startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if (slotTime.length === 7) {
                slotTime = '0' + slotTime;
            }
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
                    getCalenderDetails()
                    setState({ ...state, snackOpen: true, message: 'Slot removed!' });
                } else {
                    setState({ ...state, snackOpen: true, message: 'Something went wrong!' });
                }
            }
        }
    }

    const addBooking = async () => {
        let selectedDate = new Date(currentDate.getTime() + (data.index * 24 * 60 * 60 * 1000));
        for (let i = 0; i < slots.length; i++) {
            let slotTime = new Date(slots[i].startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            slotTime = slotTime.length === 7 ? '0' + slotTime : slotTime;
            if (selectedDate.getDate() === new Date(slots[i].startDate).getDate() && slotTime === data.time) {
                const practiceId = parseInt(localStorage.getItem('userId'));
                const service = parseInt(serviceId);
                try {
                    let response = await BackendService.addBooking({
                        practiceId,
                        serviceId: service,
                        firstName: name,
                        email: email,
                        mobileNumber: mobile,
                        additionalNotes: notes.length !== 0 ? notes : 'NA',
                        slotId: parseInt(slots[i].slotId),
                        fromTime: new Date(slots[i].startDate).getTime()
                    });
                    if (response.data.status) {
                        setAnchorEl(null);
                        setEmail('');
                        setName('');
                        setMobile('');
                        setNotes('');
                        setData({});
                        getCalenderDetails();
                        closeBookingDialog();
                        setState({ ...state, snackOpen: true, message: 'Booking confirmed!' });
                    } else {
                        setState({ ...state, snackOpen: true, message: 'Something went wrong!' });
                    }
                } catch (error) {
                    setState({ ...state, snackOpen: true, message: 'Something went wrong!' });
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
            handleBookedClosed();
            getCalenderDetails()
            setState({ ...state, snackOpen: true, message: 'Booking cancelled!' });
        } else {
            setState({ ...state, snackOpen: true, message: 'Something went wrong!' });
        }
    }

    return (
        <Paper>
            <CssBaseline />
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                key={`${vertical},${horizontal}`}
                open={snackOpen}
                onClose={handleSnackClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{message}</span>}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container style={{ marginLeft: '20px' }}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="select-date"
                        label="Select Date"
                        value={currentDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </Grid>
            </MuiPickersUtilsProvider>
            <Grid container >
                <Grid item xs className={classes.grid}>
                    {/* <Button disabled variant="outlined" className={classes.blankButton}></Button> */}
                </Grid>
                {weekDays.map(index => (
                    <Grid key={index} item xs className={classes.staticGrid}>
                        <Typography>{new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[0]}</Typography>
                        <Typography>{`${new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getDate()} ${new Date(currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[1]}`}</Typography>
                    </Grid>
                ))}
            </Grid>
            {timingSlots.map(time => (
                <Grid container key={time} >
                    <Grid item xs className={classes.staticGrid}>
                        <Typography>{time}</Typography>
                    </Grid>
                    {weekDays.map(index => (
                        <Grid key={index} item xs className={classes.grid}>
                            {checkSlot(index, time) === 'slot' &&
                                <div>
                                    <Button variant="outlined" style={{ color: 'blue' }} className={classes.button}
                                        onClick={(e) => handleClick(e, index, time)}>Available</Button>
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
                                            onClick={() => openBookingDialog()}
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
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                fullWidth
                                            />
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="email"
                                                label="Email Address"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                fullWidth
                                            />
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="mobile"
                                                label="Mobile"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
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
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                fullWidth
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={closeBookingDialog} color="secondary">
                                                Cancel
                                            </Button>
                                            <Button onClick={addBooking} color="secondary"
                                                disabled={email.length === 0 || name.length === 0
                                                    || mobile.length === 0}>
                                                Submit
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            }
                            {checkSlot(index, time).status === 'booking' &&
                                <div>
                                    <Button variant="outlined" style={{ color: 'green' }} className={classes.button}
                                        onClick={() => handleBookedOpen(index, time)}>{bookings[checkSlot(index, time).index].firstName.split(" ")[0].length < 10 ? bookings[checkSlot(index, time).index].firstName.split(" ")[0] : bookings[checkSlot(index, time).index].firstName.split(" ")[0].slice(0, 10) + '...'}</Button>
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
                                <Button disabled={true} className={classes.button}>Closed</Button>
                            }
                            {!checkSlot(index, time) &&
                                <Tooltip title="Add Slot" arrow>
                                    <Button className={classes.button} onClick={() => addSlot(index, time)}></Button>
                                </Tooltip>
                            }
                        </Grid>
                    ))}
                </Grid>
            ))}
        </Paper>
    );
}
