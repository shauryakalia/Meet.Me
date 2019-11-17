import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import image from '../images/signin.jpg';
import BackendServices from '../services/backendServices';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    imageDiv: {
        backgroundSize: 'cover',
        width: '100%',
        height: '100%',
        backgroundPosition: 'center',
    },
    image: {
        position: 'absolute',
        top: 0
    },
    title: {
        position: 'absolute',
        margin: '30px',
        zIndex: 1,
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        email: '',
        password: ''
    });

    const [state, setState] = React.useState({
        open: false,
        message: '',
        vertical: 'top',
        horizontal: 'right',
    });

    const { vertical, horizontal, open, message } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const login = async () => {
        try {
            let response = await BackendServices.login({
                practiceEmail: values.email,
                password: values.password
            });
            if (response.data.status) {
                setState({ ...state, open: true, message: 'Login Successfully!' });
                localStorage.setItem('email', response.data.data.email);
                localStorage.setItem('userId', response.data.data.userId);
                localStorage.setItem('token', response.data.data.token);
                window.location.pathname = '/profile';
            } else {
                setState({ ...state, open: true, message: 'Invalid Data!' });
            }
        } catch (error) {
            if (new Error(error).message === 'Error: Request failed with status code 422')
                setState({ ...state, open: true, message: 'Invalid Data!' });
            else
                setState({ ...state, open: true, message: new Error(error).message });
        }
    }



    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                key={`${vertical},${horizontal}`}
                open={open}
                onClose={handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{message}</span>}
            />
            <Grid item xs={false} sm={4} md={7} className={classes.imageDiv} >
                <Typography component="h1" variant="h4" className={classes.title}>
                    MeetMe
                </Typography>
                <img src={image} alt="medical" className={classes.image} />

            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={values.email}
                            onChange={handleChange('email')}
                            autoComplete="email"
                            inputProps={{
                                'aria-label': 'email',
                            }}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={values.password}
                            onChange={handleChange('password')}
                            inputProps={{
                                'aria-label': 'password',
                            }}
                            autoComplete="current-password"
                        />
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={login}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}