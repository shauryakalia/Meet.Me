import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Divider, Typography, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import {Business, Person, LocalHospital, ContactMail, Phone} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        borderRadius: 0
    },
    title: {
        marginBottom: theme.spacing(2)
    }
}));

export default function BasicProfile() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        email: 'abc@gmail.com',
        practiceName: '',
        name: '',
        phone: '',
        address: ''
    });

    return (
        <Paper className={classes.root}>
            <Typography variant="h6" color="secondary">
                Basic Profile
            </Typography>
            <Divider />
            <List component="nav" aria-label="basic-profile">
                <ListItem >
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText primary={values.name} />
                </ListItem>
                <ListItem >
                    <ListItemIcon>
                        <LocalHospital />
                    </ListItemIcon>
                    <ListItemText primary={values.practiceName} />
                </ListItem>
                <ListItem >
                    <ListItemIcon>
                        <ContactMail />
                    </ListItemIcon>
                    <ListItemText primary={values.email} />
                </ListItem>
                <ListItem >
                    <ListItemIcon>
                        <Phone />
                    </ListItemIcon>
                    <ListItemText primary={values.phone} />
                </ListItem>
                <ListItem >
                    <ListItemIcon>
                        <Business />
                    </ListItemIcon>
                    <ListItemText primary={values.address} />
                </ListItem>
            </List>
        </Paper>
    );
}