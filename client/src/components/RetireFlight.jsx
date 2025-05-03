import React, { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';
export default function AddRetireFlightForm() 
{
  const [flightID, setFlightID] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => 
  
  {
    
    e.preventDefault(); //
    setMessage('');
    setError(false);

    try 
    {
      const response = await axios.post('/api/retire_flight', { flightID });
      if (response.status === 200 && 
        response.data.status
         === 'success') 
         {
        setFlightID('');
        navigate('/flights');
      } 
      else
      {
        setError(true);
        setMessage(response.data.error || 'something didnt work');
      }

    } 
    catch (err) 
    {
      setError(true);
      setMessage(err.response?.data?.error ||'cant reach server');
    }
  };

  return (

    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Retire a Flight</h2>
      <div className="form-grid">
        <div className="form-group">

          <label htmlFor="flightID">Flight ID</label>
          <input id="flightID"
            name="flightID"
            value={flightID} onChange={(e) => setFlightID(e.target.value)} autoComplete="off" required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit">Retire</button>
      </div>
      {message && ( <p className={error ? 'error-text' : 'message'}>
          {message}
        </p>
      )}
    </form>
  );
}
