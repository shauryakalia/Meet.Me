import React from "react";
import PropTypes from 'prop-types';
import { Paper, Tabs, Tab, Typography, Box } from "@material-ui/core";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
    Scheduler,
    WeekView,
    MonthView,
    Appointments
} from "@devexpress/dx-react-scheduler-material-ui";
import { withStyles } from '@material-ui/styles';
import { appointments } from "./data";

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

class Calender extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: appointments,
            period: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event, newValue) => {
        this.setState({ period: newValue });
    };


    render() {
        const { data, period } = this.state;

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
                    <Paper>
                        <Scheduler data={data}>
                            <ViewState currentDate="2018-06-28" />
                            <WeekView startDayHour={9} endDayHour={19} />
                            <Appointments />
                        </Scheduler>
                    </Paper>
                </TabPanel>
                <TabPanel value={period} index={1}>
                    <Paper>
                        <Scheduler data={data}>
                            <ViewState currentDate="2018-06-28" />
                            <MonthView startDayHour={9} endDayHour={19} />
                            <Appointments />
                        </Scheduler>
                    </Paper>
                </TabPanel>
            </Paper>
        );
    }
}

export default withStyles({}, { withTheme: true })(Calender)