import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Paper, Typography, Box, Tab, Tabs
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
            slots: []
        }
        this.getSlots = this.getSlots.bind(this);
        this.getServices = this.getServices.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = () => {
        this.getServices();
    }

    getServices = async () => {
        try {
            const practiceId = parseInt(this.state.practiceId);
            if (practiceId) {
                let response = await BackendService.getServices(practiceId);
                if (response.data.data.length === 0) {
                    alert('No services found!');
                }
                this.getSlots(response.data.data[0].serviceId);
                this.setState({ services: response.data.data });
            } else {
                alert('Something went wrong');
            }
        } catch (error) {
            alert('Something went wrong');
        }
    }

    getSlots = async (serviceId) => {
        try {
            let response = await BackendService.getSlots(this.state.practiceId, serviceId);
            this.setState({ slots: response.data.data });
        } catch (error) {
            console.log("Error", error);
        }
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
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
                                            color: 'grey',
                                            padding: '10px'
                                        }} >
                                            <Typography>{`${new Date(this.state.currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[0]}`}</Typography>
                                            <Typography>{`${new Date(this.state.currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).getDate()} ${new Date(this.state.currentDate.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString().split(" ")[1]}`}</Typography>
                                        </Paper>
                                        {/* {checkSlot(index, service.serviceid) && */}
                                        < Typography > Abc</Typography>
                                        {/* }  */}
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