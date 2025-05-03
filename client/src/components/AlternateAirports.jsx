import React from 'react';
import axios from "axios";

import './Form.css';

function AlternateAirports() 
{
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => 
  {

    getData();
  }, []);

  function getData() 
  {
    setLoading(true);
    axios.get('/api/alternate_airports')
      .then(function(res) 
      {
        setRows(res.data);
        setError('');
      })
      .catch(function(e) 
      {
        setError(e.response && e.response.data 
          && 
          e.response.data.error ? e.response.data.error : 'couldnt load alternate airports');
      })
      .finally(function() 
      {
        setLoading(false);
      });
  }

  function renderNames(names) 
  {
    if (!names) return '-';
    const arr = names.split(', ');
    let out = [];

    for (let i = 0; i < arr.length; i++) 
    {
      out.push(<li key={i}>{arr[i]}</li>);
    }
    return <ul className="cell-list">{out}</ul>;
  }
  return (
    <div className="view-container">
      <h2>Alternate Airports</h2>
      <button
        className="refresh-btn"
        onClick={getData}
        disabled={loading}
      >
        {loading ? "loading" : "refresh"}
      </button>
      {error ? <div className="error-text">{error}</div> : null}
      <table className="data-table">
        <thead>
          <tr>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th># Airports</th>
            <th>Codes</th>
            <th>Names</th>
          </tr>
        </thead>
        <tbody>

          {rows && rows.length > 0 ? rows.map((r, idx) => 
          {
            return (
              <tr key={r.city + idx}>
                <td>{r.city}</td>
                <td>{r.state ? r.state : '-'}</td>
                <td>{r.country}</td>

                <td>{r.num_airports}</td>

                <td>{r.airport_code_list ? r.airport_code_list : '-'}</td>

                <td>{renderNames(r.airport_name_list)}</td>
              </tr>
            )
          }) : (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: '#aaa' }}>
                {loading ? '' : 'nothing to show.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AlternateAirports;
