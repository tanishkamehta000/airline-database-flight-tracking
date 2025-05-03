import React, { useState } from 'react';


import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

export default function AssignPilot() 
{
  const [flightID, setFlightID] = useState('');

  const [personID, setPersonID] = useState('');

  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const submit = async (e)=> 
  {

    e.preventDefault();
    setMsg('');
    setError(false);

    try //
    {
      const res = await axios.post('/api/assign_pilot', { flightID, personID });

      if (res.status === 200 && 
        res.data.status==='success') 
      {

        setFlightID('');
        setPersonID('');
        //
        navigate('/view_persons');

      }
       else
       {

        setError(true);
        setMsg(res.data.error||'somethng went wrong');

      }
    } catch (e) 
    {

      setError(true);
      setMsg(e.response?.data?.error ||'cant reach the server');

    }

  };

  return (
    
    <form className="form-container" onSubmit={submit}>
      <h2>Assign Pilot</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="flightID">Flight ID</label>

          <input id="flightID" name="flightID"
            value={flightID}
            onChange={e => setFlightID(e.target.value)}
            autoComplete="off" required
          />
        </div>
        <div className="form-group">
          <label htmlFor="personID">Pilot (Person ID)</label>
          <input id="personID"
            name="personID" value={personID} onChange={e => setPersonID(e.target.value)} autoComplete="off"
            required
            
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit">Assign Pilot</button>
      </div>

      {msg && (

        <p className={error ? 'error-text' : 'message'}>
          {msg}
        </p>
      )}
    </form>

  );

}
