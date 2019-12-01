import React from 'react';
import PropTypes from 'prop-types';
import {
    Grid, Paper, Typography, Box, Tab, Tabs, Button,
    Dialog, DialogActions, DialogContent, TextField, DialogTitle
} from '@material-ui/core';
import BackendService from '../services/backendServices';

const weekDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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
            services: [],
            practiceId: props.practiceId,
            value: 0,
            currentDate: new Date(),
            slots: [],
            closedIndex: [],
            openDialog: false,
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
        this.openBookingDialog = this.openBookingDialog.bind(this);
        this.closeBookingDialog = this.closeBookingDialog.bind(this);
        this.textChange = this.textChange.bind(this);
    }

    componentDidMount = () => {
        this.getServices();
    }

    openBookingDialog = () => {
        this.setState({ openDialog: true });
    };

    closeBookingDialog = () => {
        this.setState({ openDialog: false });
    };

    textChange = prop => event => {
        let booking = this.state.bookingData;
        booking = { ...booking, [prop]: event.target.value };
        this.setState({ bookingData: booking });
    };

    getTimings = async () => {
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
                    for (j = 0; j < weekDays.length; j++) {
                        const selectedDay = new Date(this.state.currentDate.getTime() + (weekDays[j] * 24 * 60 * 60 * 1000)).toDateString().split(" ")[0];
                        if (selectedDay.toLowerCase() === closedDays[i].day.slice(0, 3)) {
                            closedIndex[j] = weekDays[j];
                        }
                    }
                }
                if (j === weekDays.length && i === closedDays.length) {
                    console.log("Closed", closedIndex);
                    return closedIndex;
                }
            }
        } catch (error) {
            alert('Something went wrong');
        }
    }

    getServices = async () => {
        try {
            const practiceId = parseInt(this.state.practiceId);
            if (practiceId) {
                let response = await BackendService.getServices(practiceId);
                if (response.data.data.length === 0) {
                    alert('No services found!');
                }
                let slots = await this.getSlots(response.data.data[0].serviceId);
                const closedDays = await this.getTimings();
                this.setState({ services: response.data.data, slots: slots, closedIndex: closedDays });
            } else {
                alert('Something went wrong');
            }
        } catch (error) {
            alert('Something went wrong');
        }
    }

    getSlots = async (serviceId) => {
        const data = Promise.all(weekDays.map(async index => {
            const selectedDate = new Date(this.state.currentDate.getTime() + (index * 24 * 60 * 60 * 1000));
            let formattedDate = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate();
            try {
                let response = await BackendService.getSlots({
                    practiceId: this.state.practiceId,
                    serviceId,
                    date: formattedDate,
                });
                return response.data.data;
            } catch (error) {
                console.log("Error", error);
            }
        }))
        return data;
    }

    addBooking = async (service, slot) => {
        const practiceId = this.state.practiceId;
        const serviceId = service.serviceId;
        let response = await BackendService.addBooking({
            practiceId,
            serviceId,
            firstName: this.state.bookingData.name,
            email: this.state.bookingData.email,
            mobileNumber: this.state.bookingData.mobile,
            additionalNotes: this.state.bookingData.notes !== undefined ? this.state.bookingData.notes : 'NA',
            slotId: slot.slotId,
            fromTime: new Date(slot.startDate).getTime()
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
            alert('Booking Confirmed')
            this.forceUpdate();
        } else {
            alert("Something went wrong");
        }
    }

    handleChange = async (event, newValue) => {
        let slots = await this.getSlots(this.state.services[newValue].serviceId);
        const closedDays = await this.getTimings();
        this.setState({ value: newValue, slots: slots, closedIndex: closedDays });
    }

    render() {

        return (
            <Paper square>
                <Tabs
                    value={this.state.value}
                    key={this.state.value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    aria-label="tabs"
                >
                    {this.state.services.map((service, index) => (
                        <LinkTab key={service.serviceName} label={service.serviceName} {...a11yProps(index)} />
                    ))}
                </Tabs>
                {this.state.services.map((service, index) => (
                    <TabPanel key={service.serviceId} value={this.state.value} index={index}>
                        <Paper>
                            <Grid container >
                                {weekDays.map(index => (
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
                                        {this.state.closedIndex.length !== 0 && this.state.closedIndex[index] !== index ?
                                            this.state.slots[index].length !== 0 ? this.state.slots[index].map(slot => (
                                                <div>
                                                    <Button key={slot.slotId} variant="contained" color='primary'
                                                        onClick={this.openBookingDialog}
                                                        style={{
                                                            borderRadius: 0, border: '1px solid darkGrey',
                                                            margin: '5px', marginLeft: '15px', boxShadow: 'none'
                                                        }}>
                                                        {new Date(slot.startDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
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
                                                            <Button onClick={() => this.addBooking(service, slot)} color="secondary"
                                                                disabled={this.state.bookingData.email === undefined || this.state.bookingData.name === undefined
                                                                    || this.state.bookingData.mobile === undefined}>
                                                                Submit
                                                    </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </div>
                                            ))
                                                :
                                                <Typography variant="subtitle2"
                                                    style={{
                                                        textAlign: 'center',
                                                        marginTop: '15px',
                                                        marginBottom: '15px'
                                                    }}>None Available</Typography>
                                            :
                                            <Typography variant="subtitle2"
                                                style={{
                                                    textAlign: 'center',
                                                    marginTop: '15px',
                                                    marginBottom: '15px'
                                                }}>Closed</Typography>
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