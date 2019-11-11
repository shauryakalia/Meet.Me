import React from 'react';
import { withStyles } from '@material-ui/styles';
import MaterialTable from 'material-table';
import BackendService from '../services/backendServices';

class Prices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Service', field: 'service' },
        { title: 'Price($)', field: 'price' },
      ],
      data: [],
    }
    this.populate = this.populate.bind(this);
    this.addPrice = this.addPrice.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.deletePrice = this.deletePrice.bind(this);
  }

  populate = async () => {
    try {
      const practiceId = localStorage.getItem('userId');
      if (practiceId) {
        let response = await BackendService.getPrices(practiceId);
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

  addPrice = async (newData) => {
    try {
      const practiceId = localStorage.getItem('userId');
      let response = await BackendService.registerPrice({
        practiceId,
        service: newData.service,
        price: newData.price
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
      alert("Something went wrong");
    }
  }

  updatePrice = async(newData, oldData) => {
    try {
      if (oldData) {
        const practiceId = localStorage.getItem('userId');
        let response = await BackendService.updatePrice({
          practiceId,
          priceId: newData.priceId,
          service: newData.service,
          price: newData.price
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

  deletePrice = async(oldData) => {
    try {
      if (oldData) {
        const practiceId = localStorage.getItem('userId');
        let response = await BackendService.deletePrice({
          practiceId,
          priceId: oldData.priceId
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
      console.log("Error", error);
      alert("Something went wrong");
    }
  }

  render() {
    return (
      <MaterialTable
        title="Price List"
        options={{ pageSize: 7 }}
        columns={this.state.columns}
        data={this.state.data}
        editable={{
          onRowAdd: newData => this.addPrice(newData),
          onRowUpdate: (newData, oldData) => this.updatePrice(newData, oldData),
          onRowDelete: oldData => this.deletePrice(oldData),
        }}
      />
    );
  }
}

export default withStyles({}, { withTheme: true })(Prices)