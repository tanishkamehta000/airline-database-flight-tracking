import React, { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function AddPassengerBoardForm() 
{
  const navigate = useNavigate();
  const [flightID, setFlightID] = useState('');
  const [msg, setMsg] = useState('');

  const [isError, setIsError] = useState(false);

  async function handleSubmit(e) 

  {
    e.preventDefault();
    setMsg('');
    setIsError(false);

    try 
    {
      const res = await axios.post('/api/passengers_board', { flightID });
      
      if (res.status === 200 && res.data.status === 'success') 
      {
        setFlightID('');
        navigate('/view_persons');
      } else 
      {
        setIsError(true);
        setMsg(res.data.error || 'unknown error occurred');
      }
    } catch (err) 
    {
      setIsError(true);
      setMsg(err.response?.data?.error || 'unable to connect to server');
    }
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>passengers_board()</h2>
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
        <button type="submit">Board Passengers</button>
      </div>
      {msg && (
        <p className={isError ? 'error-text' : 'message'}>
          {msg}
        </p>
      )}
    </form>
  );
}

export default AddPassengerBoardForm;
