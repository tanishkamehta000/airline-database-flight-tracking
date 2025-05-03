import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import './Form.css';

function AddPersonForm() 
{
  const navigate = useNavigate();
  const [role, setRole] = useState('pilot');
  const [form, setForm] = useState({
    personID: '', first_name: '', last_name: '',
    locationID: '', taxID: '', experience: '',
    miles: '', funds: ''

  });
  const [msg, setMsg] = useState('');

  function handleChange(e) 
  {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleRoleChange(newRole) 
  {

    setRole(newRole);
    setForm(f => ({
      ...f,
      taxID: newRole === 'passenger' ? '' : f.taxID,
      experience: newRole === 'passenger' ? '' : f.experience,
      miles: newRole === 'pilot' ? '' : f.miles,
      funds: newRole === 'pilot' ? '' : f.funds
    }));

  }

  function nullify(v) 
  {
    return v.trim() === '' ? null : v;
  }

  function validate() 
  {
    if (role === 'pilot') 
    {
      return form.taxID && form.experience !== '' && !form.miles && !form.funds;
    }
    if (role === 'passenger') 
    {
      return form.miles !== '' && form.funds !== '' && !form.taxID && !form.experience;
    }
    return false;
  }

  async function handleSubmit(e) 
  {
    e.preventDefault();
    if (!validate()) 
    {
      setMsg('fill only the fields that apply to the chosen role.');
      return;
    }
    const submission = 
    {
      personID: form.personID, first_name: form.first_name,
      last_name: nullify(form.last_name), locationID: form.locationID, taxID: nullify(form.taxID),
      experience: form.experience === '' ? null : parseInt(form.experience, 10), miles: form.miles === '' ? null : parseInt(form.miles, 10),
      funds: form.funds === '' ? null : parseFloat(form.funds)
    };
    try 
    {
      const res = await axios.post('/api/persons', submission);
      if (res.data && res.data.status === 'success') 
      {
        navigate('/view_persons');
      } else 
      {
        const msgText = res.data?.error || 'unknown server response.';
        setMsg(msgText);
      }
    } catch (err) 
    {

      const msgText = err.response?.data?.error || err.message;
      setMsg(msgText);

    }
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>add_person()</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="radio"
            name="role"
            value="pilot"
            checked={role === 'pilot'}
            onChange={() => handleRoleChange('pilot')}
          /> Pilot
        </label>
        &nbsp;&nbsp;
        <label>
          <input
            type="radio"
            name="role"
            value="passenger"
            checked={role === 'passenger'}
            onChange={() => handleRoleChange('passenger')}
          /> Passenger
        </label>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Person ID:</label>
          <input name="personID" value={form.personID} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>First Name:</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name (optional):</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Location ID:</label>
          <input name="locationID" value={form.locationID} onChange={handleChange} required />
        </div>
        {role === 'pilot' && (
          <>
            <div className="form-group">
              <label>Tax ID:</label>
              <input name="taxID" value={form.taxID} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Experience (legs):</label>
              <input
                name="experience"
                type="number"
                value={form.experience}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        {role === 'passenger' && (
          <>
            <div className="form-group">
              <label>Miles:</label>
              <input
                name="miles"
                type="number"
                value={form.miles}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Funds:</label>
              <input
                name="funds"
                type="number"
                step="0.01"
                value={form.funds}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
      </div>
      <div className="form-actions">
        <button type="submit">Add</button>
      </div>
      {msg && <p className="message">{msg}</p>}
    </form>
  );
}

export default AddPersonForm;
