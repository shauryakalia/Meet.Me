import React, { Component } from 'react';
import { Router } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './theme';
import { Loader, Footer } from './components';
import Loadable from 'react-loadable';
import { History } from './services';
import './App.css'

const Loading = (props) => <Loader {...props} />


const Home = Loadable({
  loader: () => import('./views/Home'),
  loading: Loading
});

const BookAppointment = Loadable({
  loader: () => import('./views/BookAppointment'),
  loading: Loading
});

const Profile = Loadable({
  loader: () => import('./views/Profile'),
  loading: Loading
});

const SignIn = Loadable({
  loader: () => import('./views/SignIn'),
  loading: Loading
});

const SignUp = Loadable({
  loader: () => import('./views/SignUp'),
  loading: Loading
});

class App extends Component {

  render() {
    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router history={History.loc}>
            <Switch>
              <Route exact path="/signin" component={SignIn} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/practice/:practiceId/booking" component={BookAppointment} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/profile" component={Profile} />
              {localStorage.getItem('userId') &&
                <Route exact path="/" component={Home} />
              }
              {!localStorage.getItem('userId') &&
                <Route exact path="/" component={SignIn} />
              }
            </Switch>
          </Router>
          <Footer />
        </ThemeProvider>
      </React.Fragment>
    )
  }
}

export default App;
