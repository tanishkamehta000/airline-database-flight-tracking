import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Form.css';

export default function ViewAirplanes()

 {
  const [planes, setPlanes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function fetchPlanes() 
  {
    setLoading(true);
    setError('');
    axios.get('/api/airplanes')
      .then(response => 
        
        {
        setPlanes(response.data);
      })
      .catch(err => 
        {
        setError(err.response?.data?.error || 'couldnt load airplanes');
      })
      .finally(() => 
      {
        setLoading(false);
      });
  }

  useEffect(() => 
  {
    fetchPlanes();
  }, []);

  return (
    <div className="view-container">
      <h2>View Airplanes</h2>
      <button onClick={fetchPlanes} disabled={loading}>
        {loading ? 'loading' : 'refresh'}
      </button>

      {error && <p className="error-text">{error}</p>}

      {!loading && !error && planes.length === 0 && (
        <p>No airplanes to show.</p>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Airline ID</th>
            <th>Tail #</th>
            <th># Seats</th>
            <th>Speed</th>

            <th>Location ID</th>
            <th>Type</th>
            <th>Maintenanced</th>
            <th>Model</th>
            <th>NEO?</th>
          </tr>
        </thead>

        <tbody>
          {planes.map((plane, index) => (
            <tr key={`${plane.airlineID}-${plane.tail_num}-${index}`}>
              <td>{plane.airlineID}</td>
              <td>{plane.tail_num}</td>
              <td>{plane.seat_capacity}</td>
              <td>{plane.speed}</td>

              <td>{plane.locationID || '-'}</td>
              <td>{plane.plane_type || '-'}</td>
              <td>{plane.maintenanced == null ? '-' : String(plane.maintenanced).toUpperCase()}</td>
              <td>{plane.model || '-'}</td>
              <td>{plane.neo == null ? '-' : String(plane.neo).toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}
