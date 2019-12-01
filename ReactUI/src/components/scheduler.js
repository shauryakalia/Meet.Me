import React from "react";
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab, Typography, Box } from "@material-ui/core";
import { withStyles } from '@material-ui/styles';
import { WeekView } from '../components';
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

class Scheduler extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            slots: [],
            bookings: [],
            timings: [],
            // serviceId: localStorage.getItem('serviceId'),
            period: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.getCalendarSlots = this.getCalendarSlots.bind(this);
        this.getCalendarBookings = this.getCalendarBookings.bind(this);
        this.getTimings = this.getTimings.bind(this);
    }

    componentDidMount() {
        this.getCalendarSlots();
        this.getCalendarBookings();
        this.getTimings();
    }

    handleChange = (event, newValue) => {
        this.setState({ period: newValue });
    };

    getTimings = async () => {
        try {
            const practiceId = localStorage.getItem('userId');
            if (practiceId) {
                let response = await BackendService.getTimings(practiceId);
                const closedDays = response.data.data.filter(item => {
                    return item.closed;
                });
                this.setState({ timings: closedDays });
            }
        } catch (error) {
            alert('Something went wrong');
        }
    }

    getCalendarSlots = async () => {
        try {
            const practiceId = localStorage.getItem('userId');
            const serviceId = localStorage.getItem('serviceId');
            if (practiceId) {
                if (serviceId) {
                    let response = await BackendService.getCalendarSlots({
                        practiceId: practiceId,
                        serviceId: serviceId
                    });
                    this.setState({ slots: response.data.data });
                }
            } else {
                window.location.pathname = '/signin';
            }
        } catch (error) {
            alert('Something went wrong');
        }
    }

    getCalendarBookings = async () => {
        try {
            const practiceId = localStorage.getItem('userId');
            const serviceId = localStorage.getItem('serviceId');
            if (practiceId) {
                if (serviceId) {
                    let response = await BackendService.getCalendarBookings({
                        practiceId: practiceId,
                        serviceId: serviceId
                    });
                    this.setState({ bookings: response.data.data });
                }
            } else {
                window.location.pathname = '/signin';
            }
        } catch (error) {
            console.log("Errro", error);
            alert('Something went wrong');
        }
    }


    render() {
        const { slots, bookings, timings, period } = this.state;

        return (
            <Paper square>
                <Tabs
                    value={period}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    aria-label="tabs"
                >
                    <Tab label="Week" {...a11yProps(0)} />
                    <Tab label="Month" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={period} index={0}>
                    <WeekView slots={slots} bookings={bookings} timings={timings}/>
                </TabPanel>
                <TabPanel value={period} index={1}>
                    <Paper>
                        xyz
                    </Paper>
                </TabPanel>
            </Paper>
        );
    }
}

export default withStyles({}, { withTheme: true })(Scheduler)