import React, { useState } from 'react';

import axios from 'axios';
import './Form.css';

export default function ToggleLicense() {
  const [personID, setPersonID] = useState('');
  const [license, setLicense]   = useState('');
  const [msg, setMsg]           = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/pilot_licenses/toggle', { personID, license });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>toggle_license()</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Person ID</label>
          <input
            name="personID"
            value={personID}
            onChange={e => setPersonID(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>License</label>
          <input
            name="license"
            value={license}
            onChange={e => setLicense(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit">Toggle License</button>
      </div>

      {msg   && <p className="message">{msg}</p>}
      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
