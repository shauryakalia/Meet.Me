import React from 'react';
import { withStyles } from '@material-ui/styles';
import MaterialTable from 'material-table';
import BackendService from '../services/backendServices';

class Services extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Name', field: 'serviceName' },
      ],
      data: [],
    }
    this.populate = this.populate.bind(this);
    this.addService = this.addService.bind(this);
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  populate = async () => {
    try {
      const practiceId = localStorage.getItem('userId');
      if (practiceId) {
        let response = await BackendService.getServices(practiceId);
        this.setState({ data: response.data.data })
      } else {
        window.location.pathname = '/signin';
      }
    } catch (error) {
      alert('Something went wrong');
    }
  }

  componentWillMount() {
    this.populate();
  }

  addService = async (newData) => {
    try {
      const practiceId = localStorage.getItem('userId');
      let response = await BackendService.registerService({
        practiceId,
        serviceName: newData.serviceName
      });
      if (response.data.status) {
        this.setState(prevState => {
          const data = [...prevState.data];
          data.push(newData);
          return { ...prevState, data };
        });
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.log("Error", error);
      alert("Something went wrong");
    }
  }

  updateService = async(newData, oldData) => {
    try {
      if (oldData) {
        const practiceId = localStorage.getItem('userId');
        let response = await BackendService.updateService({
          practiceId,
          serviceId: newData.serviceId,
          serviceName: newData.serviceName
        });
        if (response.data.status) {
          this.setState(prevState => {
            const data = [...prevState.data];
            data[data.indexOf(oldData)] = newData;
            return { ...prevState, data };
          });
        } else {
          alert("Something went wrong");
        }
      }
    } catch (error) {
      console.log("Error", error);
      alert("Something went wrong");
    }
  }

  deleteService = async(oldData) => {
    try {
      if (oldData) {
        const practiceId = localStorage.getItem('userId');
        let response = await BackendService.deleteService({
          practiceId,
          serviceId: oldData.serviceId
        });
        if (response.data.status) {
          this.setState(prevState => {
            const data = [...prevState.data];
            data.splice(data.indexOf(oldData), 1);
            return { ...prevState, data };
          });
        } else {
          alert("Something went wrong");
        }
      }
    } catch (error) {
      alert("Something went wrong");
    }
  }

  render() {
    return (
      <MaterialTable
        title="Service List"
        options={{ pageSize: 3 }}
        columns={this.state.columns}
        data={this.state.data}
        editable={{
          onRowAdd: newData => this.addService(newData),
          onRowUpdate: (newData, oldData) => this.updateService(newData, oldData),
          onRowDelete: oldData => this.deleteService(oldData),
        }}
      />
    );
  }
}

export default withStyles({}, { withTheme: true })(Services)