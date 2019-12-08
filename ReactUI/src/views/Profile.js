import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { BasicProfile, Timings, Services, Prices } from '../components';
import UserIcon from '@material-ui/icons/Person';
import BackendService from '../services/backendServices';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
        cursor: 'pointer'
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        marginTop: theme.spacing(5),
        padding: theme.spacing(10),
    }
}));

export default function Profile() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [state, setState] = React.useState({
        open: false,
        message: '',
        vertical: 'top',
        horizontal: 'right',
    });

    const { vertical, horizontal, open, message } = state;

    const handleSnackClose = () => {
        setState({ ...state, open: false });
    };

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const home = async () => {
        try {
            const practiceId = localStorage.getItem('userId');
            if (practiceId) {
                let response = await BackendService.getServices(practiceId);
                if (response.data.data.length > 0) {
                    window.location.pathname = '/home';
                } else {
                    setState({ ...state, open: true, message: 'Register atleast one service!' });
                }
            } else {
                window.location.pathname = '/signin';
            }
        } catch (error) {
            setState({ ...state, open: true, message: 'Something went wrong!' });
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        localStorage.removeItem('serviceId');
        window.location.pathname = '/signin'
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar color='secondary'>
                <Toolbar >
                    <Typography component="h1" variant="h6" color="inherit" noWrap onClick={home} className={classes.title}>
                        MeetMe
                    </Typography>
                    <IconButton style={{color: 'white'}} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        <UserIcon />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>

                </Toolbar>
            </AppBar>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                key={`${vertical},${horizontal}`}
                open={open}
                onClose={handleSnackClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{message}</span>}
            />
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Grid container spacing={3}>
                    <Grid item xs={6} container spacing={3}>
                        <Grid item xs={12}>
                            <BasicProfile />
                        </Grid>
                        <Grid item xs={12}>
                            <Prices />
                        </Grid>
                    </Grid>
                    <Grid item xs={6} container spacing={3}>
                        <Grid item xs={12}>
                            <Services />
                        </Grid>
                        <Grid item xs={12}>
                            <Timings />
                        </Grid>
                    </Grid>
                </Grid>
            </main>
        </div>
    );
}