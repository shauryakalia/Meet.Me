import React, { Component } from 'react';
import { Router } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './theme';
import { Loader, Header, Footer } from './components';
import Loadable from 'react-loadable';
import { History } from './services';
import './App.css'

const Loading = (props) => <Loader {...props} />


const Home = Loadable({
  loader: () => import('./views/Home'),
  loading: Loading
});

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router history={History.loc}>
            <Switch>
              <Route exact path="/" component={Home} />
              {/* <Route path="/profile" component={profile} /> */}
            </Switch>
          </Router>
        </ThemeProvider>
        <Footer />
      </React.Fragment>
    )
  }
}

export default App;
