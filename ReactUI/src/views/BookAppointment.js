import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Paper, AppBar, Toolbar, Typography, CssBaseline, Grid, Box, Tabs, Tab
} from '@material-ui/core';
import BackendService from '../services/backendServices';


const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

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

class BookAppointment extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            practiceId: props.match.params.practiceId,
            value: 0,
            services: [],
            timings: [],
            prices: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.getServices = this.getServices.bind(this);
        this.getPriceList = this.getPriceList.bind(this);
        this.getTimings = this.getTimings.bind(this);
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    }

    componentDidMount() {
        this.getServices();
    }

    getTimings = async () => {
        try {
            const practiceId = this.state.practiceId;
            if (practiceId) {
                let response = await BackendService.getTimings(practiceId);
                const sortedDays = await response.data.data.sort((a, b) => a.timingId - b.timingId);
                this.setState({ timings: sortedDays })
            }
        } catch (error) {
            alert('Something went wrong');
        }
    }

    getPriceList = async () => {
        try {
            const practiceId = this.state.practiceId;
            if (practiceId) {
                let response = await BackendService.getPrices(practiceId);
                console.log("Prices", response.data.data);
                this.setState({ prices: response.data.data })
            }
        } catch (error) {
            alert('Something went wrong');
        }
    }

    getServices = async () => {
        try {
            const practiceId = this.state.practiceId;
            if (practiceId) {
                let response = await BackendService.getServices(practiceId);
                this.setState({ services: response.data.data });
                this.getPriceList();
                this.getTimings();
                if (response.data.data.length === 0) {
                    alert('No services found!');
                }
            } else {
                alert('Something went wrong');
            }
        } catch (error) {
            alert('Something went wrong');
        }
    }

    render() {
        return (
            <div >
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" >
                            MeetMe
                    </Typography>
                    </Toolbar>
                </AppBar>
                <Grid container style={{ margin: '10px', width: '97%' }} spacing={3}>
                    <Grid item xs={12}>
                        <Paper square>
                            <Tabs
                                value={this.state.value}
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
                                <TabPanel value={this.state.value} index={index}>
                                    {service.serviceName}
                                </TabPanel>
                            ))}
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" >
                            Price List
                    </Typography>
                        <Paper style={{ marginTop: '10px' }}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Service</StyledTableCell>
                                        <StyledTableCell align="right">Price(£)</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                {this.state.prices.length !== 0 ?
                                    <TableBody>
                                        {this.state.prices.map(row => (
                                            <StyledTableRow key={row.service}>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.service}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">{row.price}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                    :
                                    <TableBody>
                                        <StyledTableRow >
                                            <StyledTableCell align="right" component="th" scope="row">
                                                No prices found
                                            </StyledTableCell>
                                            <StyledTableCell >
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                }
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" >
                            Opening Hours
                    </Typography>
                        <Paper style={{ marginTop: '10px' }}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Days</StyledTableCell>
                                        <StyledTableCell align="right">Time</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.timings.map(row => (
                                        <StyledTableRow key={row.day}>
                                            <StyledTableCell style={{ textTransform: 'capitalize' }} component="th" scope="row">
                                                {row.day}
                                            </StyledTableCell>
                                            {row.from.length !== 0 ?
                                                <StyledTableCell align="right">{row.from} - {row.to}</StyledTableCell>
                                                :
                                                <StyledTableCell align="right">Closed</StyledTableCell>}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles({}, { withTheme: true })(BookAppointment)