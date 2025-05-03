import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Form.css';

export default function RouteSummary() 
{
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => 
  {

    setLoading(true);
    try 
    {
      const res = await axios.get('/api/route_summary');
      setRows(res.data);
      setError('');
    } catch (err) 
    {

      console.error('fetch route_summary error:', err);
      setError('failed to load route summary');
      
    } 
    finally 
    {
      setLoading(false);
    }
  }, []);

  useEffect(() => 
  {
    fetchData();
  }, [fetchData]);

  return (
    <div className="view-container">
      <h2>Route Summary</h2>
      <button
        className="refresh-btn"
        onClick={fetchData}
        disabled={loading}
      >
        {loading ? 'loading' : 'refresh'}
      </button>

      {error && <p className="error-text">{error}</p>}

      {!loading && !error && rows.length === 0 && (
        <p>No route summaries available.</p>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Route</th>
            <th># Legs</th>
            <th>Leg Sequence</th>
            <th>Total Distance</th>
            <th># Flights</th>
            <th>Flight List</th>
            <th>Airport Sequence</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.route || idx}>
              <td>{r.route}</td>
              <td>{r.num_legs}</td>
              <td>
                {Array.isArray(r.leg_sequence)
                  ? r.leg_sequence.join(', ')
                  : r.leg_sequence}
              </td>
              <td>
                {typeof r.route_length === 'number'
                  ? `${r.route_length.toLocaleString()} km`
                  : r.route_length}
              </td>
              <td>{r.num_flights}</td>
              <td>
                {Array.isArray(r.flight_list)
                  ? r.flight_list.join(', ')
                  : r.flight_list}
              </td>
              <td>
                {Array.isArray(r.airport_sequence) ? r.airport_sequence.join(' → ') : r.airport_sequence}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
