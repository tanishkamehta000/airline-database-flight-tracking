import React from 'react';
import axios from 'axios';

import './Form.css';

function FlightsInAir()

{
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() =>
  {
    fetchFlights();
  }, []);

  function fetchFlights()
  {
    setLoading(true);
    axios.get('/api/flights_in_air')
      .then(function(res) 

      {
        setRows(res.data);
        setError('');
      })

      .catch(function(err) 

      {
        let msg = 'failed to load flights in air';

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

  let tableBody;
  if (rows && rows.length > 0) 
  {
    tableBody = rows.map(function(r, i)

    {
      return (
        <tr key={i}>
          <td>{r.departing_from}</td>
          <td>{r.arriving_at}</td>

          <td>{r.num_flights}</td>
          <td>{r.flight_list}</td>
          <td>{r.earliest_arrival}</td>
          <td>{r.latest_arrival}</td>
          <td>{r.airplane_list}</td>
        </tr>
      )
    });
  } 
  else 
  {

    tableBody = (
      <tr>
        <td colSpan={7} style={{ textAlign: 'center', color: '#aaa' }}>
          {loading ? '' : 'no flights in the air right now'}
        </td>
      </tr>
    );
  }

  return (
    <div className="view-container">
      <h2>Flights in the Air</h2>

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

            <th>Departing From</th>
            <th>Arriving At</th>
            <th># Flights</th>
            <th>Flights List</th>
            <th>Earliest Arrival</th>
            <th>Latest Arrival</th>
            <th>Airplanes</th>

          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </table>
    </div>
  );
}

export default FlightsInAir;
