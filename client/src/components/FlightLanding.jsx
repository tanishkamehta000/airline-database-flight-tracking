import React, { useState } from 'react';

import axios from 'axios';
import './Form.css'; //

function FlightLandingForm() 
{
  const [flightID, setFlightID] = useState('');
  const [msg, setMsg] = useState('');

  const [error, setError] = useState('');

  function handleSubmit(e) 
  {
    e.preventDefault();

    axios.post('/api/flight_landing', { flightID })
      .then(() => 
      {
        setMsg('landing processed');
        setError('');
        setFlightID('');
      })
      .catch(err => 
        {
          
        setError(err.response && err.response.data 
          && err.response.data.error ? err.response.data.error : 'error');
        setMsg('');

      });
  }
  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>flight_landing()</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Flight ID</label>
          <input
            name="flightID"
            value={flightID}
            onChange={e => setFlightID(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit">Process Landing</button>
      </div>

      {msg ? <p className="message">{msg}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </form>
  );
}

export default FlightLandingForm;
