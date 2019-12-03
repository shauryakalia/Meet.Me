import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import UserIcon from '@material-ui/icons/Person';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { Bookings, Scheduler, WeekView } from '../components';
import BackendService from '../services/backendServices';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
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
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
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

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            open: true,
            anchorEl: null,
            value: 0,
            practiceName: '',
            serviceId: null,
            timings: [],
            selectedIndex: 0,
        }
        this.getServices = this.getServices.bind(this);
        this.getTimings = this.getTimings.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.logout = this.logout.bind(this);
        this.openProfile = this.openProfile.bind(this);
        this.handleListItemClick = this.handleListItemClick.bind(this);
    }

    componentDidMount() {
        this.getServices();
        this.getTimings();
    }

    getServices = async () => {
        try {
            const practiceId = localStorage.getItem('userId');
            if (practiceId) {
                let response = await BackendService.getServices(practiceId);
                let res = await BackendService.getPracticeDetails(practiceId);
                this.setState({ data: response.data.data, serviceId: response.data.data[0].serviceId, practiceName: res.data.data.practiceName });
            } else {
                window.location.pathname = '/signin';
            }
        } catch (error) {
            console.log("Error", error);
            alert('Something went wrong');
        }

    }

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

    handleListItemClick = (event, index, serviceId) => {
        // this.getCalendarSlots(serviceId);
        // this.getCalendarBookings(serviceId);
        this.setState({ selectedIndex: index, serviceId: serviceId });
    };

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };
    // const handleDrawerClose = () => {
    //     this.setState({ open: false });
    // };

    logout = () => {
        localStorage.clear();
        window.location.pathname = '/signin'
    };

    openProfile = () => {
        window.location.pathname = '/profile'
    };

    render() {
        return (
            <div style={{ overflowX: 'hidden', overflowY: 'hidden', minHeight: '100vh' }}>
                <CssBaseline />
                <AppBar position='static' color='secondary'>
                    <Toolbar >
                        <Typography component="h1" variant="h6" color="inherit" style={{ flexGrow: 1 }} >
                            MeetMe
                        </Typography>
                        <IconButton style={{ color: 'white', marginLeft: '80%' }} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                            <Typography component="h3" variant="subtitle1" color="inherit" >
                                {this.state.practiceName}
                            </Typography>
                            <UserIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl)}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={this.openProfile}>Profile</MenuItem>
                            <MenuItem onClick={this.logout}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <Paper style={{ height: '100%', minHeight: '100vh' }}>
                            <List>
                                <ListSubheader inset>Services</ListSubheader>
                                {this.state.data.map((item, index) => (
                                    <ListItem key={item.serviceId} button
                                        selected={parseInt(this.state.selectedIndex) === index}
                                        onClick={event => this.handleListItemClick(event, index, item.serviceId)}
                                    >
                                        <ListItemIcon>
                                            <DashboardIcon />
                                        </ListItemIcon>
                                        <ListItemText secondary={item.serviceName} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item style={{ marginTop: '20px', minHeight: '100vh' }} xs={9}>
                        <Container maxWidth="lg" >
                            <Paper square>
                                <Tabs
                                    value={this.state.value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={this.handleChange}
                                    aria-label="tabs"
                                >
                                    <LinkTab label="Diary" {...a11yProps(0)} />
                                    <LinkTab label="Bookings" {...a11yProps(1)} />
                                </Tabs>
                                <TabPanel value={this.state.value} index={0}>
                                    <WeekView serviceId={this.state.serviceId} timings={this.state.timings} />
                                </TabPanel>
                                <TabPanel value={this.state.value} index={1}>
                                    <Bookings serviceId={this.state.serviceId} />
                                </TabPanel>
                            </Paper>
                        </Container>
                    </Grid>
                </Grid>

            </div>
        );
    }
}

export default withStyles({}, { withTheme: true })(Home)