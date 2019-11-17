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

export default function SignUp() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        zipcode: '',
        practiceName: '',
        address: '',
        password: '',
        confirmPassword: ''
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

    const register = async () => {
        try {
            if (values.password === values.confirmPassword) {
                let response = await BackendServices.registerPractice({
                    practiceEmail: values.email,
                    password: values.password,
                    practiceName: values.practiceName,
                    practiceAddress: values.address,
                    practiceZipcode: values.zipcode,
                    yourName: values.name,
                    yourRole: values.role,
                    practicePhoneNumber: values.phone
                });
                if (response.data.status) {
                    setState({ ...state, open: true, message: 'Signup Successfully!' });
                    window.location.pathname = '/signin';
                } else {
                    setState({ ...state, open: true, message: 'Invalid Data!' });
                }
            } else {
                setState({ ...state, open: true, message: 'Password does not match!' });
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
                        Sign Up
                    </Typography>
                    <form className={classes.form} noValidate>
                        <div className="row" style={{ marginLeft: '1px' }}>
                            <TextField
                                margin="dense"
                                required
                                id="name"
                                label="Name"
                                name="name"
                                value={values.name}
                                onChange={handleChange('name')}
                                autoComplete="name"
                                inputProps={{
                                    'aria-label': 'name',
                                }}
                                autoFocus
                            />
                            <TextField
                                margin="dense"
                                required
                                id="role"
                                label="Role"
                                name="role"
                                style={{ marginLeft: '33px' }}
                                value={values.role}
                                onChange={handleChange('role')}
                                autoComplete="role"
                                inputProps={{
                                    'aria-label': 'role',
                                }}
                                autoFocus
                            />
                        </div>
                        <div className="row" style={{ marginLeft: '1px' }}>
                            <TextField
                                margin="dense"
                                required
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
                                margin="dense"
                                required
                                id="phone"
                                label="Phone"
                                name="phone"
                                style={{ marginLeft: '33px' }}
                                value={values.phone}
                                onChange={handleChange('phone')}
                                autoComplete="phone"
                                inputProps={{
                                    'aria-label': 'phone',
                                }}
                                autoFocus
                            />
                        </div>
                        <TextField
                            margin="dense"
                            required
                            fullWidth
                            id="address"
                            label="Address"
                            name="address"
                            value={values.address}
                            onChange={handleChange('address')}
                            autoComplete="address"
                            inputProps={{
                                'aria-label': 'address',
                            }}
                            autoFocus
                        />
                        <div className="row" style={{ marginLeft: '1px' }}>
                            <TextField
                                margin="dense"
                                required
                                id="practiceName"
                                label="Practice Name"
                                name="practiceName"
                                value={values.practiceName}
                                onChange={handleChange('practiceName')}
                                autoComplete="practiceName"
                                inputProps={{
                                    'aria-label': 'practiceName',
                                }}
                                autoFocus
                            />
                            <TextField
                                margin="dense"
                                required
                                id="zipcode"
                                label="Zipcode"
                                name="zipcode"
                                style={{ marginLeft: '33px' }}
                                value={values.zipcode}
                                onChange={handleChange('zipcode')}
                                autoComplete="zipcode"
                                inputProps={{
                                    'aria-label': 'zipcode',
                                }}
                                autoFocus
                            />
                        </div>
                        <div className="row" style={{ marginLeft: '1px' }}>
                            <TextField
                                margin="dense"
                                required
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
                            <TextField
                                margin="dense"
                                required
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                style={{ marginLeft: '33px' }}
                                value={values.confirmPassword}
                                onChange={handleChange('confirmPassword')}
                                inputProps={{
                                    'aria-label': 'password',
                                }}
                            />
                        </div>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={register}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/signin" variant="body2">
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}