import React from 'react';
import axios from 'axios';
import './Form.css';

function PeopleOnGround() 
{

  var [rows, setRows] = React.useState([]);
  var [loading, setLoading] = React.useState(false);
  var [error, setError] = React.useState('');

  React.useEffect(function() 
  {
    fetchData();
  }, []);

  function fetchData() 
  {
    setLoading(true);
    axios.get('/api/people_on_ground')
      .then(function(res) 
      {

        setRows(res.data);
        setError('');

      })
      .catch(function(err)
       {
        var msg = 'failed to load people on ground';

        if (err.response && err.response.data && err.response.data.error) 
        {
          msg = err.response.data.error;
        }
        setError(msg);
      })
      .finally(function() 
      {
        setLoading(false);
      });
  }

  var tableRows;
  if (rows && rows.length > 0) 
  {
    tableRows = [];
    for (var i = 0; i < rows.length; i++) 
    {
      var r = rows[i];
      tableRows.push(
        <tr key={i}>
          <td>{r.departing_from}</td>
          <td>{r.airport}</td>
          <td>{r.airport_name}</td>
          <td>{r.city}</td>
          <td>{r.state || '-'}</td>
          <td>{r.country}</td>
          <td>{r.num_pilots}</td>
          <td>{r.num_passengers}</td>
          <td>{r.joint_pilots_passengers}</td>
          <td>{r.person_list}</td>
        </tr>
      );
    }
  } else 
  {
    tableRows = (
      <tr>
        <td colSpan={10} style={{ textAlign: 'center', color: '#aaa' }}>
          {loading ? '' : ' no people on the ground right now'}
        </td>
      </tr>
    );
  }

  return (
    <div className="view-container">
      <h2>people on the ground</h2>
      <button
        className="refresh-btn"
        onClick={fetchData}
        disabled={loading}
        style={{ marginBottom: 10 }}
      >
        {loading ? 'loading' : 'refresh'}
      </button>
      {error ? <div className="error-text">{error}</div> : null}
      <table className="data-table">
        <thead>
          <tr>

            <th>Departing From</th>
            <th>Airport ID</th>
            <th>Airport Name</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th># Pilots</th>
            <th># Passengers</th>
            <th># Total</th>
            <th>Person List</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </div>
  );
}

export default PeopleOnGround;
