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
      selectedIndex: localStorage.getItem('serviceIndex') !== undefined ? localStorage.getItem('serviceIndex') : 0,
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
        this.setState({ data: response.data.data });
        localStorage.setItem('serviceId', response.data.data[this.state.selectedIndex].serviceId);
        localStorage.setItem('serviceIndex', this.state.selectedIndex);
      } else {
        window.location.pathname = '/signin';
      }
    } catch (error) {
      alert('Something went wrong');
    }

  }

  handleListItemClick = (event, index, serviceId) => {
    localStorage.setItem('serviceId', serviceId);
    localStorage.setItem('serviceIndex', index);
    this.setState({ selectedIndex: index });
    window.location.reload(false);
  };

  render() {
    return (
      <List>
        <ListSubheader inset>Services</ListSubheader>
        {this.state.data.map((item, index) => (
          <ListItem key={item.serviceId} button
            selected={parseInt(this.state.selectedIndex) === index}
            onClick={event => this.handleListItemClick(event, index, item.serviceId)}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText secondary={item.serviceName} />
          </ListItem>
        ))}
      </List>
    )
  }
}

export default withStyles({}, { withTheme: true })(ListItems)