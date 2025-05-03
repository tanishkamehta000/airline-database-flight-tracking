import React, { useState } from 'react';

//imp form.css
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

export default function SimulationCycle() 
{
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');


  const navigate = useNavigate();

  const next = async () =>
   {
    setMsg(''); 
    
    setErr('');
    try 
    {
      await axios.post('/api/simulation_cycle');
      setMsg('moved to next step');
    } 
    catch (e) 
    {
      setErr(e.response?.data?.error||'something broke');
    }
    
  };

  const cancel = () => 
  {

    navigate('/');
  };
//
  return (
    <form className="form-container" onSubmit={e => e.preventDefault()}>
      <h2>Simulation Cycle</h2>
      <div className="form-actions">
        <button type="button" onClick={cancel}>Cancel</button>
        <button type="button" onClick={next}>Next Step</button>
      </div>

      {msg && <p className="message">{msg}</p>}
      {err && <p className="error-text">{err}</p>}
    </form>
  );

}
