import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';

export default function ViewPersons() 
{

  const [people, setPeople] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPeople = async () => 
  {
    setLoading(true);
    setError('');
    try 
    {

      const { data } = await axios.get('/api/persons');
      setPeople(data);

    } 
    catch 
    {

      setError(' something went wrong while loading');
    } 

    finally 
    {
      setLoading(false);
    }
  };

  useEffect(() => 
  {

    loadPeople();

  }, []);

  return (

    <div className="view-container">

      <h2>People Directory</h2>
      <button className="refresh-btn" onClick={loadPeople} disabled={loading}>
        {loading ? 'loading' : 'refresh'}
      </button>
      {error && <p className="error-text">{error}</p>}
      {!error && !loading && people.length === 0 && (
        <p>no people to show right now</p>
        
      )}

      {people.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>id</th>
              <th>First</th>
              <th>Last</th>
              <th>Location</th>

              <th>commanding flight</th>
              <th>Tax id</th>
              <th>Experience</th>
              <th>Miles</th>
              <th>Funds</th>
            </tr>
          </thead>
          <tbody>

            {people.map(({ personID, first_name, last_name, 
            locationID, 
            commanding_flight, taxID, experience, miles, 
            funds }) => 
            (
              <tr key={personID}>
                <td>{personID}</td>
                <td>{first_name}</td>
                <td>{last_name}</td>
                <td>{locationID}</td>
                <td>{commanding_flight || '–'}</td>
                <td>{taxID}</td>
                <td>{experience}</td>
                <td>{miles}</td>
                <td>{funds}</td>
              </tr>

            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
