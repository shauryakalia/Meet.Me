import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Divider, Typography, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { Business, Person, LocalHospital, ContactMail, Phone } from '@material-ui/icons';
import BackendService from '../services/backendServices';

class BasicProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            practiceName: '',
            name: '',
            phone: '',
            address: ''
        }
        this.getProfile = this.getProfile.bind(this);
    }

    componentDidMount() {
        this.getProfile();
    }

    getProfile = async () => {
        try {
            const practiceId = localStorage.getItem('userId');
            if (practiceId) {
                let response = await BackendService.getPracticeDetails(practiceId);
                this.setState({
                    name: response.data.data.yourName,
                    practiceName: response.data.data.practiceName,
                    email: response.data.data.practiceEmail,
                    address: response.data.data.practiceAddress,
                    phone: response.data.data.practicePhoneNumber
                })
            } else {
                window.location.pathname = '/signin';
            }
        } catch (error) {
            console.log("Error", error);
            alert('Something went wrong');
        }
    }

    render() {
        return (
            <Paper style={{ padding: '15px', paddingLeft: '20px', paddingRight: '20px' }}>
                <Typography variant="h6" >
                    Profile
            </Typography>
                <Divider />
                <List component="nav" aria-label="basic-profile">
                    <ListItem >
                        <ListItemIcon>
                            <Person />
                        </ListItemIcon>
                        <ListItemText primary={this.state.name} />
                    </ListItem>
                    <ListItem >
                        <ListItemIcon>
                            <LocalHospital />
                        </ListItemIcon>
                        <ListItemText primary={this.state.practiceName} />
                    </ListItem>
                    <ListItem >
                        <ListItemIcon>
                            <ContactMail />
                        </ListItemIcon>
                        <ListItemText primary={this.state.email} />
                    </ListItem>
                    <ListItem >
                        <ListItemIcon>
                            <Phone />
                        </ListItemIcon>
                        <ListItemText primary={this.state.phone} />
                    </ListItem>
                    <ListItem >
                        <ListItemIcon>
                            <Business />
                        </ListItemIcon>
                        <ListItemText primary={this.state.address} />
                    </ListItem>
                </List>
            </Paper>
        );
    }
}

export default withStyles({}, { withTheme: true })(BasicProfile)