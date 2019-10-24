import React from 'react';
import { AppBar, Button, Toolbar, Typography, InputBase } from '@material-ui/core';
import { fade, withStyles } from '@material-ui/core/styles';
import { Search } from '@material-ui/icons';
import Cookies from 'js-cookie';
import { History, BackendServices } from '../services';


const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  Search: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  button: {
    margin: theme.spacing(1),
    textTransform: "initial"
  },
  paper: {
    position: 'fixed',
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    backgroundColor: theme.palette.background.paper,
    borderWidth: '12px',
    borderStyle: 'solid',
    borderColor: theme.palette.secondary.main,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(8),
    outline: 'none',
  },
  circle: {
    position: 'absolute',
    height: '80px',
    width: '80px',
    borderRadius: '40px',
    left: '43%',
    top: '-48px',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.background.paper,
  },
  circleIcon: {
    position: 'absolute',
    height: '60px',
    width: '60px',
    borderRadius: '40px',
    left: '13%',
    top: '9px',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.background.paper,
  },
  subtitle: {
    padding: theme.spacing(2),
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.menuClose = this.menuClose.bind(this);
    this.menuOpen = this.menuOpen.bind(this);
    this.signOut = this.signOut.bind(this);
    this.nextPath = this.nextPath.bind(this);
    this.switchEnterance = this.switchEnterance.bind(this);
    this.popIn = this.popIn.bind(this);
    // this.signUp = this.signUp.bind(this);
  }

  // Cookies.remove('userLogin');

  menuOpen(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  menuClose() {
    this.setState({ anchorEl: null });
  }

  popIn(userDetail) {

    BackendServices.popIn(userDetail)
      .then((response) => {
        Cookies.set('userLogin', userDetail);
        Cookies.set('userToken', response.data.data.token);
        Cookies.set('userId', response.data.data.userId);
        console.log(response.data)
        this.setState({ userLogin: userDetail });
      })
      .catch((err) => {
        if (err.response) {
          console.log("err response=  ", err);
        } else {
          console.log("err=  ", err);
        }
      });
  }

  signOut() {
    Cookies.remove('userLogin');
    Cookies.remove('userToken');
    Cookies.remove('userId');
    this.setState({ userLogin: Cookies.get('userLogin') })
    this.menuClose();
    this.nextPath('/')
  }

  nextPath(path) {
    History.loc.push(path);
    this.menuClose()
  }

  switchEnterance() {
    this.setState({ enterType: !this.state.enterType })
  }

  render() {
    // const classes = useStyles();
    let { classes } = this.props;
    
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography className={classes.title} variant="h6" color="secondary" noWrap>
              TEST
          </Typography>
            <div className={classes.search}>
              <div className={classes.Search}>
                <Search />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <div>
              <Button type="button" variant="outlined" size="small" color="secondary" className={classes.button}>
                Login
            </Button>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
export default withStyles(useStyles)(Header);