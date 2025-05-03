import React from 'react';
import axios from 'axios';
import './Form.css';

function OfferFlightForm() 
{
  const [form, setForm] = React.useState({
    flightID: '', routeID: '', support_airline: '', support_tail: '', progress: 0,
    next_time: '', cost: 0
  });
  const [msg, setMsg] = React.useState('');

  function handleChange(e) 
  {
    var name = e.target.name;
    var value = e.target.value;
    setForm(function(f) 
    {
      var updated = { ...f };
      if (name === 'progress' || name === 'cost') 
      {
        updated[name] = Number(value);
      } 
      else 
      {
        updated[name] = value;
      }
      return updated;
    });
  }

  function handleSubmit(e) 
  {

    e.preventDefault();
    axios.post('/api/offer_flight', form)
      .then(function() {})
      .catch(function(err) 
      {

        var msg = 'error with offering flight';
        if (err.response && err.response.data && err.response.data.error) 
        {
          msg = err.response.data.error;
        }
        setMsg(msg);

      });
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>offer_flight()</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Flight ID</label>
          <input
            name="flightID"
            value={form.flightID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Route ID</label>
          <input
            name="routeID"
            value={form.routeID}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Support Airline</label>
          <input
            name="support_airline"
            value={form.support_airline}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Support Tail</label>
          <input
            name="support_tail"
            value={form.support_tail}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Progress</label>
          <input
            name="progress"
            type="number"
            min="0"
            max="100"
            value={form.progress}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Next Time (HH:MM:SS)</label>
          <input
            name="next_time"
            value={form.next_time}
            onChange={handleChange}
            placeholder="e.g. 13:45:00"
            required
          />
        </div>
        <div className="form-group">
          <label>Cost</label>
          <input
            name="cost"
            type="number"
            min="0"
            step="any"
            value={form.cost}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit">Offer Flight</button>
      </div>
      {msg ? <p className="message">{msg}</p> : null}
    </form>
  );
}

export default OfferFlightForm;
