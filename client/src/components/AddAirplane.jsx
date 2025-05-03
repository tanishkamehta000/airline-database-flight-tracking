import React, { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function AddAirplaneForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    airlineID: '', tail_num: '', seat_capacity: '',
    speed: '', locationID: '', plane_type: '', maintenanced: '',
    model: '', neo: ''
  });
  const [msg, setMsg] = useState('');

  function handleChange(e) 
  {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) 
  {
    e.preventDefault();
    const nullify = v => (v === '' || v.toUpperCase() === 'NULL') ? null : v;
    const asBool = v => (v === '' ? null : v === 'true');
    const submission = {
      airlineID: form.airlineID,
      tail_num: form.tail_num,
      seat_capacity: parseInt(form.seat_capacity, 10),
      speed: parseInt(form.speed, 10),
      locationID: form.locationID,
      plane_type: form.plane_type,
      maintenanced: asBool(form.maintenanced),
      model: nullify(form.model),
      neo: asBool(form.neo)
    };

    try 
    {
      await axios.post('/api/airplanes', submission);
      navigate('/view_airplanes');
    } catch (err) {
      setMsg(err.response?.data?.error || 'error adding airplane');
    }
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>add_airplane()</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Airline ID:</label>
          <input
            name="airlineID"
            value={form.airlineID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tail Num:</label>
          <input
            name="tail_num"
            value={form.tail_num}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Seat Cap:</label>
          <input
            name="seat_capacity"
            type="number"
            value={form.seat_capacity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Speed:</label>
          <input
            name="speed"
            type="number"
            value={form.speed}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Location ID:</label>
          <input
            name="locationID"
            value={form.locationID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Plane Type:</label>
          <select
            name="plane_type"
            value={form.plane_type}
            onChange={handleChange}
            required
          >
            <option value="">Select…</option>
            <option value="Boeing">Boeing</option>
            <option value="Airbus">Airbus</option>
            <option value="General">General</option>
            <option value="Neither">Neither</option>
          </select>
        </div>
        <div className="form-group">
          <label>Maintenanced (optional):</label>
          <select
            name="maintenanced"
            value={form.maintenanced}
            onChange={handleChange}
          >
            <option value="">Leave blank (null)</option>
            <option value="true">TRUE</option>
            <option value="false">FALSE</option>
          </select>
        </div>
        <div className="form-group">
          <label>Model (optional):</label>
          <input
            name="model"
            placeholder="Leave blank or type NULL"
            value={form.model}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Neo:</label>
          <select
            name="neo"
            value={form.neo}
            onChange={handleChange}
            required
          >
            <option value="">Select …</option>
            <option value="true">TRUE</option>
            <option value="false">FALSE</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="submit">Add</button>
      </div>
      {msg && <p className="message">{msg}</p>}
    </form>
  );
}

export default AddAirplaneForm;
