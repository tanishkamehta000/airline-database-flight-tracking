import React, { useState } from 'react';


import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function AddFlightTakeoffForm() 
{
  const [flightID, setFlightID] = useState('');
  
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) 
  {
    e.preventDefault();
    try 
    {
      await axios.post('/api/flight_takeoff', { flightID });
      setFlightID('');
      navigate('/flights_in_air');
    } catch (err) 
    {
      const serverMessage = err.response?.data?.error || err.message;
      setFeedback(serverMessage);
    }
  }

  return (

    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Take Off Flight</h2>
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
        <button type="submit">Confirm Takeoff</button>
      </div>
      {feedback && <p className="error-text">{feedback}</p>}
    </form>
  );
}

export default AddFlightTakeoffForm;
