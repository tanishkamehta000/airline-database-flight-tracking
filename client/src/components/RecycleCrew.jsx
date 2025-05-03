// client/src/components/RecycleCrewForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

export default function RecycleCrewForm() {
  const [flightID, setFlightID] = useState('');
  const [msg, setMsg]           = useState('');
  const [isError, setIsError]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setIsError(false);

    try {
      const res = await axios.post('/api/recycle_crew', { flightID });
      if (res.status === 200 && res.data.status === 'success') {
        setFlightID('');             // clear the field
        navigate('/view_persons');    // go see your recycled crew
      } else {
        setIsError(true);
        setMsg(res.data.error || 'Unknown error');
      }
    } catch (err) {
      setIsError(true);
      setMsg(err.response?.data?.error || err.message);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>recycle_crew()</h2>

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
        <button type="submit">Recycle</button>
      </div>

      {msg && (
        <p className={isError ? 'error-text' : 'message'}>
          {msg}
        </p>
      )}
    </form>
  );
}
