import React from 'react';
import { withStyles } from '@material-ui/styles';
import MaterialTable from 'material-table';
import BackendService from '../services/backendServices';

class Timings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Day', field: 'day' },
        { title: 'Open at', field: 'from' },
        { title: 'Close at', field: 'to' },
        { title: 'Closed', field: 'closed', type: 'boolean' },
      ],
      data: [],
    }
    this.populate = this.populate.bind(this);
    // this.addTiming = this.addTiming.bind(this);
    this.updateTiming = this.updateTiming.bind(this);
    // this.deleteTiming = this.deleteTiming.bind(this);
  }

  populate = async () => {
    try {
      const practiceId = localStorage.getItem('userId');
      if (practiceId) {
        let response = await BackendService.getTimings(practiceId);
        const sortedDays = await response.data.data.sort((a,b) => a.timingId - b.timingId);
        console.log("Time get response", sortedDays);
        this.setState({ data: sortedDays })
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

  // addTiming = async (newData) => {
  //   try {
  //     const practiceId = localStorage.getItem('userId');
  //     let response = await BackendService.registerTiming({
  //       practiceId,
  //       day: newData.day,
  //       from: newData.from,
  //       to: newData.to,
  //       closed: newData.closed
  //     });
  //     if (response.data.status) {
  //       this.setState(prevState => {
  //         const data = [...prevState.data];
  //         data.push(newData);
  //         return { ...prevState, data };
  //       });
  //     } else {
  //       alert("Something went wrong");
  //     }
  //   } catch (error) {
  //     console.log("Error", error);
  //     alert("Something went wrong");
  //   }
  // }

  updateTiming = async(newData, oldData) => {
    try {
      if (oldData) {
        const practiceId = localStorage.getItem('userId');
        let response = await BackendService.updateTiming({
          practiceId,
          timingId: newData.timingId,
          from: newData.from,
          to: newData.to,
          closed: newData.closed
        });
        console.log("Time update req", {
          practiceId,
          timingId: newData.timingId,
          from: newData.from,
          to: newData.to,
          closed: newData.closed
        });
        console.log("Time update res", response);
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

  // deleteTiming = async(oldData) => {
  //   try {
  //     if (oldData) {
  //       const practiceId = localStorage.getItem('userId');
  //       let response = await BackendService.deleteTiming({
  //         practiceId,
  //         timingId: oldData.timingId
  //       });
  //       if (response.data.status) {
  //         this.setState(prevState => {
  //           const data = [...prevState.data];
  //           data.splice(data.indexOf(oldData), 1);
  //           return { ...prevState, data };
  //         });
  //       } else {
  //         alert("Something went wrong");
  //       }
  //     }
  //   } catch (error) {
  //     alert("Something went wrong");
  //   }
  // }

  render() {
    return (
      <MaterialTable
        title="Opening Hours"
        options={{ pageSize: 7, search: false }}
        columns={this.state.columns}
        data={this.state.data}
        editable={{
          // onRowAdd: newData => this.addTiming(newData),
          onRowUpdate: (newData, oldData) => this.updateTiming(newData, oldData),
          // onRowDelete: oldData => this.deleteTiming(oldData),
        }}
      />
    );
  }
}

export default withStyles({}, { withTheme: true })(Timings)