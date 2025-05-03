import React from 'react';

import axios from 'axios';
import './Form.css';

function PilotLicensesList() 
{
  var [licenses, setLicenses] = React.useState([]);
  var [loading, setLoading] = React.useState(false);
  var [error, setError] = React.useState('');

  React.useEffect(function() 

  {
    fetchLicenses();
  }, []);

  function fetchLicenses() 
  {
    setLoading(true);
    axios.get('/api/pilot_licenses')
      .then(function(res) 
      {
        setLicenses(res.data);
        setError('');
      })
      .catch(function(err)
      {
        var msg = 'failed  to load licenses';
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

  if (licenses && licenses.length > 0)
   {
    
    tableRows = [];
    for (var i = 0; i < licenses.length; i++) 
    {

      var lic = licenses[i];
      tableRows.push(

        <tr key={lic.personID + '-' + lic.license + '-' + i}>
          <td>{lic.personID}</td>
          <td>{lic.license}</td>
        </tr>
      );
    }
  } 
  else 
  {
    tableRows = (
      <tr>
        <td colSpan={2} style={{ textAlign: 'center', color: '#aaa' }}>
          {loading ? '' : 'no licenses found'}
        </td>
      </tr>
    );
  }

  return (
    <div className="view-container">
      <h2>Pilot Licenses</h2>
      <button

        className="refresh-btn"
        onClick={fetchLicenses}
        disabled={loading}
        style={{ marginBottom: 10 }}
      >
        {loading ? 'loading' : ' refresh'}
      </button>
      {error ? <div className="error-text">{error}</div> : null}
      <table className="data-table">
        <thead>
          <tr>
            <th>Person ID</th>
            <th>License</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </div>
  );
}

export default PilotLicensesList;
