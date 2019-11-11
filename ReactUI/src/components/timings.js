import React from 'react';
import MaterialTable from 'material-table';

export default function Prices() {
  const [state, setState] = React.useState({
    columns: [
      { title: 'Day', field: 'day' },
      { title: 'Open at', field: 'openAt' },
      { title: 'Close at', field: 'closeAt' },
      { title: 'Closed', field: 'closed' },
    ],
    data: [
      { day: 'Monday', openAt: "abc" , closeAt: "abc" , closed: "abc" },
      { day: 'Tuesday', openAt: "abc" , closeAt: "abc" , closed: "abc"  },
      { day: 'Wednesday', openAt: "abc" , closeAt: "abc" , closed: "abc"  },
      { day: 'Thursday', openAt: "abc" , closeAt: "abc" , closed: "abc"  },
      { day: 'Friday', openAt: "abc" , closeAt: "abc" , closed: "abc"  },
      { day: 'Saturday', openAt: "abc" , closeAt: "abc" , closed: "abc"  },
      { day: 'Sunday', openAt: "abc" , closeAt: "abc" , closed: "abc" },
    ],
  });

  return (
    <MaterialTable
      title="Opening Hours"
      options={{ search: false, pageSize: 7 }}
      components={{
        Pagination: props => (
          <div ></div>
        )
      }}
      columns={state.columns}
      data={state.data}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState(prevState => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
      }}
    />
  );
}