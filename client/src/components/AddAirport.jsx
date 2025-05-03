import React, { useState } from 'react';


import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Form.css';

function AddAirportForm() {
  const navigate = useNavigate();

  const [fields, setFields] = useState(
    {
    airportID: '', airport_name: '', city: '',state: '',
    country: '', locationID: ''
  }
  );
  const [feedback, setFeedback] = useState('');

  function handleInputChange(event) 
  {
    const { name, value } = event.target;
    setFields(prevFields => (
      {
      ...prevFields,
      [name]: value
    }));
  }

  async function handleFormSubmit(event) 
  {
    event.preventDefault();

    try {
      await axios.post('/api/airports', fields);
      navigate('/view_airports');
    } catch (error) {
      setFeedback(error.response?.data?.error || 'failed to add airport');
    }
  }


  return (
    <form className="form-container" onSubmit={handleFormSubmit}>
      <h2>Register New Airport</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="airportID">Airport ID</label>
          <input
            id="airportID"
            name="airportID"
            value={fields.airportID}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="airport_name">Airport Name</label>
          <input
            id="airport_name"
            name="airport_name"
            value={fields.airport_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={fields.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            id="state"
            name="state"
            value={fields.state}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            value={fields.country}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="locationID">Location ID</label>
          <input
            id="locationID"
            name="locationID"
            value={fields.locationID}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit">Submit Airport Info</button>
      </div>
      {feedback && <p className="message">{feedback}</p>}
    </form>
  );
}

export default AddAirportForm;
