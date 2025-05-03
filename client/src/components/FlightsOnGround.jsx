import React from 'react';

import axios from 'axios';
import './Form.css';

function FlightsOnGround() 
{

  var [rows, setRows] = React.useState([]);
  var [loading, setLoading] = React.useState(false);
  var [error, setError] = React.useState('');

  React.useEffect(function() 
  {
    loadData();
  }, []);

  function loadData() 
  {
    setLoading(true);
    axios.get('/api/flights_on_ground')
      .then(function(response) 
      {
        setRows(response.data);
        
        setError('');
      })
      .catch(function(err) 
      {
        var msg = 'failed to load flights on ground';
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
          <td>{r.num_flights}</td>
          <td>{r.flight_list}</td>

          <td>{r.earliest_arrival}</td>
          <td>{r.latest_arrival}</td>
          <td>{r.airplane_list}</td>
        </tr>
      );
    }
  } else 
  {
    tableRows = (
      <tr>

        <td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>
          {loading ? '' : 'no flights on ground right now'}
        </td>
      </tr>
    );
  }

  return (
    <div className="view-container">
      <h2>Flights on the Ground</h2>
      <button
        className="refresh-btn"
        onClick={loadData}
        disabled={loading}
        style={{ marginBottom: '10px' }}
      >
        {loading ? 'loading' : 'refresh'}
      </button>
      {error ? <div className="error-text">{error}</div> : null}
      <table className="data-table">
        <thead>
          <tr>

            <th>Departing From</th>
            <th># Flights</th>
            <th>Flights List</th>
            <th>Earliest Arrival</th>
            <th>Latest Arrival</th>
            <th>Airplanes</th>

          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default FlightsOnGround;
