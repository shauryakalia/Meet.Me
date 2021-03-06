import React from 'react';
import PropTypes from 'prop-types';
import {
    Grid, Paper, Typography, Box, Tab, Tabs, Button, Snackbar, CssBaseline,
    Dialog, DialogActions, DialogContent, TextField, DialogTitle
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import BackendService from '../services/backendServices';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function LinkTab(props) {
    return (
        <Tab
            onClick={event => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

class PatientBookAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weekDays: [],
            services: [],
            practiceId: props.practiceId,
            value: 0,
            currentDate: new Date(),
            slots: [],
            selectedSlot: {},
            closedIndex: [],
            openDialog: false,
            snackOpen: false,
            message: '',
            vertical: 'top',
            horizontal: 'right',
            bookingData: {
                email: undefined,
                name: undefined,
                mobile: undefined,
                notes: undefined,
            }
        }
        this.getSlots = this.getSlots.bind(this);
        this.getServices = this.getServices.bind(this);
        this.getTimings = this.getTimings.bind(this);
        this.addBooking = this.addBooking.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.openBookingDialog = this.openBookingDialog.bind(this);
        this.closeBookingDialog = this.closeBookingDialog.bind(this);
        this.handleSnackClose = this.handleSnackClose.bind(this);
        this.textChange = this.textChange.bind(this);
    }

    componentDidMount = () => {
        if (window.innerWidth < 500) {
            this.setState({ weekDays: [0, 1, 2] })
        } else if (window.innerWidth >= 500 && window.innerWidth <= 900) {
            this.setState({ weekDays: [0, 1, 2, 3, 4] })
        } else {
            this.setState({ weekDays: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] });
        }
        this.getServices();
        this.interval = setInterval(() => this.handleDateChange(this.state.currentDate), 20000);
    }

    componentWillUnmount() {
        console.log("Unmount");
        clearInterval(this.interval);
    }

    handleSnackClose = () => {
        this.setState({ ...this.state, snackOpen: false });
    };

    handleDateChange = async date => {
        let slots = await this.getSlots(this.state.services[this.state.value].serviceId);
        const closedDays = await this.getTimings(date);
        console.log("Closed Days", closedDays);
        this.setState({ currentDate: date, slots: slots, closedIndex: closedDays });
    };

    openBookingDialog = (slot) => {
        this.setState({ selectedSlot: slot, openDialog: true });
    };

    closeBookingDialog = () => {
        this.setState({ openDialog: false });
    };

    textChange = prop => event => {
        let booking = this.state.bookingData;
        booking = { ...booking, [prop]: event.target.value };
        this.setState({ bookingData: booking });
    };

    getTimings = async (date) => {
        try {
            const practiceId = this.state.practiceId;
            if (practiceId) {
                let response = await BackendService.getTimings(practiceId);
                const closedDays = response.data.data.filter(item => {
                    return item.closed;
                });
                let closedIndex = [];
                let i, j;
                for (i = 0; i < closedDays.length; i++) {
                    for (j = 0; j < this.state.weekDays.length; j++) {
                        const selectedDay = new Date(date.getTime() + (this.state.weekDays[j] * 24 * 60 * 60 * 1000)).toDateString().split(" ")[0];
                        if (selectedDay.toLowerCase() === closedDays[i].day.slice(0, 3)) {
                            closedIndex[j] = this.state.weekDays[j];
                        }
                    }
                }
                if (j === this.state.weekDays.length && i === closedDays.length) {
                    return closedIndex;
                }
            }
        } catch (error) {
            this.setState({ ...this.state, snackOpen: true, message: 'Something went wrong!' });
        }
    }

    getServices = async () => {
        try {
            const practiceId = parseInt(this.state.practiceId);
            if (practiceId) {
                let response = await BackendService.getServices(practiceId);
                if (response.data.data.length === 0) {
                    this.setState({ ...this.state, snackOpen: true, message: 'No services found!' });
                }
                console.log("serviceID", response.data.data[0].serviceId);
                let slots = await this.getSlots(response.data.data[0].serviceId);
                const closedDays = await this.getTimings(this.state.currentDate);
                console.log("Slots", slots);
                this.setState({ services: response.data.data, slots: slots, closedIndex: closedDays });
            } else {
                this.setState({ ...this.state, snackOpen: true, message: 'Something went wrong!' });
            }
        } catch (error) {
            this.setState({ ...this.state, snackOpen: true, message: 'Something went wrong!' });
        }
    }

    getSlots = async (serviceId) => {
        const data = Promise.all(this.state.weekDays.map(async index => {
            const selectedDate = new Date(this.state.currentDate.getTime() + (index * 24 * 60 * 60 * 1000));
            let formattedDate = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate();
            try {
                let response = await BackendService.getSlots({
                    practiceId: this.state.practiceId,
                    serviceId,
                    date: formattedDate,
                });
                console.log("Slots API res", response);
                let data = response.data.data;
                data = await data.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                return data;
            } catch (error) {
                console.log("Error", error);
            }
        }))
        return data;
    }

    addBooking = async () => {
        const practiceId = this.state.practiceId;
        const serviceId = this.state.services[this.state.value].serviceId;
        console.log("Service Id ************", this.state.selectedSlot);
        if (this.state.selectedSlot) {
            let response = await BackendService.addBooking({
                practiceId,
                serviceId,
                firstName: this.state.bookingData.name,
                email: this.state.bookingData.email,
                mobileNumber: this.state.bookingData.mobile,
                additionalNotes: this.state.bookingData.notes !== undefined ? this.state.bookingData.notes : 'NA',
                slotId: this.state.selectedSlot.slotId,
                fromTime: new Date(this.state.selectedSlot.startDate).getTime()
            });
            if (response.data.status) {
                this.closeBookingDialog();
                this.setState({
                    bookingData: {
                        email: undefined,
                        name: undefined,
                        notes: undefined,
                        mobile: undefined
                    }
                })
                this.setState({ ...this.state, snackOpen: true, message: 'Booking Confirmed!' });
                this.forceUpdate();
            } else {
                this.setState({ ...this.state, snackOpen: true, message: 'Something went wrong!' });
            }
        }
        else {
            this.setState({ ...this.state, snackOpen: true, message: 'Something went wrong!' });
        }
    }

    handleChange = async (event, newValue) => {
        let slots = await this.getSlots(this.state.services[newValue].serviceId);
        const closedDays = await this.getTimings(this.state.currentDate);
        this.setState({ value: newValue, slots: slots, closedIndex: closedDays });
    }

    render() {
        const { vertical, horizontal, snackOpen, message } = this.state;

        return (
            <Paper square>
                <CssBaseline />
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    key={`${vertical},${horizontal}`}
                    open={snackOpen}
                    onClose={this.handleSnackClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{message}</span>}
                />
                <Tabs
                    value={this.state.value}
                    key={this.state.value}
                    variant="scrollable"
                    scrollButtons="auto"
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    aria-label="tabs"
                >
                    {this.state.services.map((service, index) => (
                        <LinkTab key={service.serviceName} label={service.serviceName} {...a11yProps(index)} />
                    ))}
                </Tabs>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container style={{ marginLeft: '20px' }}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="select-date"
                            label="Select Date"
                            value={this.state.currentDate}
                            onChange={this.handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
                {this.state.services.map((service, index) => (
                    <TabPanel key={service.serviceId} value={this.state.value} index={index}>
                        <Paper>
                            <Grid container >
                                {this.state.weekDays.map(index => (
                                    <Grid key={index} item xs >
                                        <Paper style={{
                                            border: '1px solid',
                                            borderColor: 'grey',
                                            borderRadius: 0,
                                            backgroundColor: '#37474f',
                                            color: 'white',
                                            padding: '10px'
                                        }} >
                                            <Typography>{`${new Date(this.state.currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[0]}`}</Typography>
                                            <Typography>{`${new Date(this.state.currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getDate()} ${new Date(this.state.currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[1]}`}</Typography>
                                        </Paper>
                                        {(this.state.slots[index] !== undefined && this.state.slots[index].length !== 0) ? this.state.slots[index].map(slot => (
                                            <div>
                                                <Button key={slot.slotId} variant="contained" color='primary'
                                                    onClick={() => this.openBookingDialog(slot)}
                                                    style={{
                                                        borderRadius: 0, border: '1px solid darkGrey',
                                                        margin: '5px', marginLeft: '15px', boxShadow: 'none'
                                                    }}>
                                                    {new Date(slot.startDate).toLocaleString('en-US', { timeZone: "UTC", hour: 'numeric', minute: 'numeric', hour12: true })}
                                                </Button>
                                                <Dialog open={this.state.openDialog} onClose={this.closeBookingDialog} aria-labelledby="form-dialog-title">
                                                    <DialogTitle id="form-dialog-title">Book an Appointment</DialogTitle>
                                                    <DialogContent>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            required
                                                            id="name"
                                                            label="Name"
                                                            type="text"
                                                            value={this.state.bookingData.name}
                                                            onChange={this.textChange('name')}
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="email"
                                                            label="Email Address"
                                                            type="email"
                                                            required
                                                            value={this.state.bookingData.email}
                                                            onChange={this.textChange('email')}
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="mobile"
                                                            label="Mobile"
                                                            value={this.state.bookingData.mobile}
                                                            onChange={this.textChange('mobile')}
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
                                                            value={this.state.bookingData.notes}
                                                            onChange={this.textChange('notes')}
                                                            fullWidth
                                                        />
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={this.closeBookingDialog} color="secondary">
                                                            Cancel
                                                            </Button>
                                                        <Button onClick={() => this.addBooking()} color="secondary"
                                                            disabled={this.state.bookingData.email === undefined || this.state.bookingData.name === undefined
                                                                || this.state.bookingData.mobile === undefined}>
                                                            Submit
                                                    </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                        ))
                                            :
                                            this.state.closedIndex.length !== 0 && this.state.closedIndex[index] === index ?
                                                <Typography variant="subtitle2"
                                                    style={{
                                                        textAlign: 'center',
                                                        marginTop: '15px',
                                                        marginBottom: '15px'
                                                    }}>Closed</Typography>
                                                :
                                                <Typography variant="subtitle2"
                                                    style={{
                                                        textAlign: 'center',
                                                        marginTop: '15px',
                                                        marginBottom: '15px'
                                                    }}>None Available</Typography>
                                        }
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper >
                    </TabPanel>
                ))}
            </Paper>
        );
    }

}

export default PatientBookAppointment;
