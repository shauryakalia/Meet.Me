import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BackendService from '../services/backendServices';

class ListItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedIndex: 0,
    }
    this.getServices = this.getServices.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  componentDidMount() {
    this.getServices();
  }

  getServices = async () => {
    try {
      const practiceId = localStorage.getItem('userId');
      if (practiceId) {
        let response = await BackendService.getServices(practiceId);
        console.log("Services", response);
        this.setState({ data: response.data.data })
        localStorage.setItem('serviceId', response.data.data[0].serviceId);
      } else {
        window.location.pathname = '/signin';
      }
    } catch (error) {
      alert('Something went wrong');
    }
  }

  handleListItemClick = (event, index, serviceId) => {
    localStorage.setItem('serviceId', serviceId);
    this.setState({ selectedIndex: index })
  };

  render() {
    return (
      <List>
        <ListSubheader inset>Services</ListSubheader>
        {this.state.data.map((item, index) => (
          <ListItem key={item.serviceId} button
            selected={this.state.selectedIndex === index}
            onClick={event => this.handleListItemClick(event, index, item.serviceId)}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={item.serviceName} />
          </ListItem>
        ))}
      </List>
    )
  }
}

export default withStyles({}, { withTheme: true })(ListItems)