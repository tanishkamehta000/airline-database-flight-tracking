import React from 'react';

import axios from 'axios';
import './Form.css';

function FlightsList() 
{

  const [flights, setFlights] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(function() 
  {
    fetchFlights();
  }, []);

  function fetchFlights() 
  {
    setLoading(true);
    setError('');

    axios.get('/api/flights')
      .then(function(res) 
      {
        setFlights(res.data);
      })
      .catch(function(err) 
      {
        let msg = 'failed to load flights';

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

  let rows;
  if (flights && flights.length) 
  {
    rows = [];
    for (let i = 0; i < flights.length; i++) 
    {
      let f = flights[i];

      rows.push(
        <tr key={i}>

          <td>{f.flightID}</td>
          <td>{f.routeID}</td>
          <td>{f.airplane_status}</td>

          <td>{f.progress}</td>
          <td>{f.next_time}</td>
          <td>{f.cost}</td>
        </tr>
      );
    }
  } 
  else 
  {
    rows = (
      <tr>
        <td colSpan={6} style={{ textAlign: 'center', color: '#aaa' }}>
          {loading ? '' : 'no flights found'}
        </td>
      </tr>
    );
  }

  return (
    <div className="view-container">
      <h2>All Flights</h2>

      <button
        className="refresh-btn"
        onClick={fetchFlights}
        disabled={loading}
        style={{ marginBottom: 10 }}
      >
        {loading ? 'loading' : 'refresh'}
      </button>
      {error ? <div className="error-text">{error}</div> : null}
      <table className="data-table">
        <thead>
          <tr>
            <th>Flight ID</th>
            <th>Route ID</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Next Time</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
}

export default FlightsList;
