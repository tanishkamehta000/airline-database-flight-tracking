import React from 'react';
import axios from 'axios';
import './Form.css';

function PeopleInAir() 
{
  var [rows, setRows] = React.useState([]);
  var [loading, setLoading] = React.useState(false);
  
  var [error, setError] = React.useState('');

  React.useEffect(function() 
  {
    fetchData();
  }, []);

  function fetchData() 
  {
    setLoading(true);
    axios.get('/api/people_in_air')
      .then(function(res) 
      {
        setRows(res.data);
        setError('');
      })
      .catch(function(err)
       {
        var msg = 'failed to load people in air';

        if (err.response && err.response.data && err.response.data.error) 
        {
          msg = err.response.data.error;
        }
        setError(msg);
      })
      .finally(function() 
      {
        setLoading(false);
      });
  }

  var tableRows;
  if (rows && rows.length > 0) 
  {
    tableRows = [];

    for (var i = 0; i < rows.length; i++) 
    {
      var r = rows[i];
      tableRows.push(
        <tr key={i}>
          <td>{r.departing_from}</td>
          <td>{r.arriving_at}</td>
          <td>{r.num_airplanes}</td>
          <td>{r.airplane_list}</td>
          <td>{r.flight_list}</td>
          <td>{r.earliest_arrival}</td>
          <td>{r.latest_arrival}</td>
          <td>{r.num_pilots}</td>
          <td>{r.num_passengers}</td>
          <td>{r.joint_pilots_passengers}</td>
          <td>{r.person_list}</td>
        </tr>
      );
    }
  } else {
    tableRows = (
      <tr>
        <td colSpan={11} style={{ textAlign: 'center', color: '#aaa' }}>
          {loading ? '' : 'no people in air currently'}
        </td>
      </tr>
    );
  }



  return (
    <div className="view-container">
      <h2>People in the Air</h2>
      <button
        className="refresh-btn"
        onClick={fetchData}
        disabled={loading}
        style={{ marginBottom: 10 }}
      >
        {loading ? 'losding' : 'refresh'}
      </button>
      {error ? <div className="error-text">{error}</div> : null}
      <table className="data-table">
        <thead>
          <tr>
            <th>Departing From</th>
            <th>Arriving At</th>
            <th># Airplanes</th>
            <th>Airplane List</th>
            <th>Flight List</th>
            <th>Earliest Arrival</th>
            <th>Latest Arrival</th>
            <th># Pilots</th>
            <th># Passengers</th>
            <th># Total</th>
            <th>Person List</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </div>
  );
}

export default PeopleInAir;
