import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Paper, AppBar, Toolbar, Typography, CssBaseline, Grid
} from '@material-ui/core';
import {PatientBookAppointment} from '../components';
import BackendService from '../services/backendServices';


const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.secondary.main,
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



class BookAppointment extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            practiceId: props.match.params.practiceId,
            timings: [],
            prices: [],
            practiceDetails: {},
        };
        this.getPracticeDetails = this.getPracticeDetails.bind(this);
        this.getPriceList = this.getPriceList.bind(this);
        this.getTimings = this.getTimings.bind(this);
    }

    componentDidMount() {
        this.getPracticeDetails();
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
                this.setState({ prices: response.data.data })
            }
        } catch (error) {
            alert('Something went wrong');
        }
    }

    getPracticeDetails = async () => {
        try {
            const practiceId = this.state.practiceId;
            if (practiceId) {
                let response = await BackendService.getPracticeDetails(practiceId);
                this.setState({ practiceDetails: response.data.data })
                this.getPriceList();
                this.getTimings();
            }
        } catch (error) {
            alert('Something went wrong');
        }
    }

    render() {
        return (
            <div >
                <CssBaseline />
                <AppBar color='secondary' position="static">
                    <Toolbar>
                        <Typography variant="h6" >
                            MeetMe
                    </Typography>
                    </Toolbar>
                </AppBar>
                <Grid container style={{ margin: '10px', width: '97%' }} spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" color='secondary'>
                            {this.state.practiceDetails.practiceName}
                        </Typography>
                        <Typography variant="subtitle1" color='secondary'>
                            Book an Appointment
                        </Typography>
                        <Typography variant="subtitle2" style={{marginBottom: '9px'}} color='primary'>
                            Select appointment specialty you require
                        </Typography>
                       <PatientBookAppointment practiceId={this.state.practiceId} />
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