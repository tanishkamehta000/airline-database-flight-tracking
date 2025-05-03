import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';

export default function ViewAirports() 

{

  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function fetchAirports() 
  {
    setLoading(true);
    setError('');
    axios.get('/api/airports')
      .then(res => 
        {
        setAirports(res.data);
      })
      .catch(err => 

        {
        setError(err.response?.data?.error || 'failed to load airports');
      })
      .finally(() => 
      {
        setLoading(false);
      });
  }

  useEffect(() =>
   {
    fetchAirports();
  }, []);

  return (
    <div className="view-container">
      <h2>View Airports</h2>
      <button

        className="refresh-btn"
        onClick={fetchAirports}
        disabled={loading}
      >

        {loading ? 'loading' : 'refresh'}

      </button>

      {error && <p className="error-text">{error}</p>}

      {!loading && !error && airports.length === 0 && 
      (
        <p>No airports found.</p>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Airport ID</th>
            <th>Name</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>location ID</th>
          </tr>
        </thead>
        <tbody>

          {airports.map((a, idx) => (

            <tr key={`${a.airportID}-${idx}`}>
              <td>{a.airportID}</td>
              <td>{a.airport_name}</td>
              <td>{a.city}</td>

              <td>{a.state}</td>
              <td>{a.country}</td>

              <td>{a.locationID || '-'}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
