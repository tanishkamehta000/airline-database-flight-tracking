import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './components/Navbar.css';
import './components/Form.css';

import AddAirplaneForm from './components/AddAirplane';
import ViewAirplanes from './components/ViewAirplanes';

import AddAirportForm from './components/AddAirport';
import ViewAirports from './components/ViewAirports';

import AddPersonForm from './components/AddPerson';
import ViewPersons from './components/ViewPersons';
import AddPassengerBoardForm from './components/PassengerBoard';
import AddPassengerDisembarkForm from './components/PassengerDisembark';
import ToggleLicenseForm from './components/ToggleLicense';
import PilotLicensesList from './components/ViewPilotLicenses';
import AssignPilot from './components/AssignPilot';


import OfferFlightForm from './components/OfferFlight';
import FlightsList from './components/ViewFlights';
import FlightLandingForm from './components/FlightLanding';
import AddFlightTakeoffForm from './components/FlightTakeoff';
import RetireFlight from './components/RetireFlight';
import RecycleCrewForm  from './components/RecycleCrew';
import SimulationCycle from './components/SimulationCycle';


import FlightsInAir from './components/FlightsInAir';
import FlightsOnGround from './components/FlightsOnGround';
import PeopleInAir from './components/PeopleInAir';
import PeopleOnGround from './components/PeopleOnGround';
import RouteSummary from './components/RouteSummary';
import AlternateAirports from './components/AlternateAirports';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <ul className="navbar-list">
          <li><Link to="/">Home</Link></li>

          <li><Link to="/add_airplane">Add Airplane</Link></li>
          <li><Link to="/view_airplanes">View Airplanes</Link></li>

          <li><Link to="/add_airport">Add Airport</Link></li>
          <li><Link to="/view_airports">View Airports</Link></li>

          <li><Link to="/add_person">Add Person</Link></li>
          <li><Link to="/view_persons">View People</Link></li>
          <li><Link to="/passengers_board">Board Passengers</Link></li>
          <li><Link to="/passengers_disembark">Disembark Passengers</Link></li>
          <li><Link to="/toggle_license">Toggle License</Link></li>
          <li><Link to="/pilot_licenses">View Licenses</Link></li>
          <li><Link to="/assign_pilot">Assign Pilot</Link></li>
          <li><Link to="/recycle_crew">Recycle Crew</Link></li>

          <li><Link to="/offer_flight">Offer Flight</Link></li>
          <li><Link to="/flights">View Flights</Link></li>          
          <li><Link to="/flight_landing">Flight Landing</Link></li>
          <li><Link to="/flight_takeoff">Flight Takeoff</Link></li>
          <li><Link to="/retire_flight">Retire Flight</Link></li>
          <li><Link to="/simulation_cycle">Simulation Cycle</Link></li>

          <li><Link to="/flights_in_air">Flights in the Air</Link></li>
          <li><Link to="/flights_on_ground">Flights on the Ground</Link></li>
          <li><Link to="/people_in_air">People in the Air</Link></li>
          <li><Link to="/people_on_ground">People on the Ground</Link></li>
          <li><Link to="/route_summary">Route Summary</Link></li>
          <li><Link to="/alternate_airports">Alternate Airports</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<p style={{ padding: '2rem' }}>Select an option above to simulate our flight tracking database!</p>} />

        <Route path="/add_airplane" element={<AddAirplaneForm />} />
        <Route path="/view_airplanes" element={<ViewAirplanes />} />

        <Route path="/add_airport" element={<AddAirportForm />} />
        <Route path="/view_airports" element={<ViewAirports />} />

        <Route path="/add_person" element={<AddPersonForm />} />
        <Route path="/view_persons" element={<ViewPersons />} />
        <Route path="/passengers_board" element={<AddPassengerBoardForm />} />
        <Route path="/passengers_disembark" element={<AddPassengerDisembarkForm />} />
        <Route path="/toggle_license" element={<ToggleLicenseForm />} />
        <Route path="/pilot_licenses" element={<PilotLicensesList />} />
        <Route path="/assign_pilot" element={<AssignPilot />} />
        <Route path="/recycle_crew"  element={<RecycleCrewForm />} />

        <Route path="/offer_flight" element={<OfferFlightForm />} />
        <Route path="/flights" element={<FlightsList />} />
        <Route path="/flight_landing" element={<FlightLandingForm />} />
        <Route path="/flight_takeoff" element={<AddFlightTakeoffForm />} />
        <Route path="/retire_flight" element={<RetireFlight />} />
        <Route path="/simulation_cycle" element={<SimulationCycle />} />

        <Route path="/flights_in_air" element={<FlightsInAir />} />
        <Route path="/flights_on_ground" element={<FlightsOnGround />} />
        <Route path="/people_in_air" element={<PeopleInAir />} />
        <Route path="/people_on_ground" element={<PeopleOnGround />} />
        <Route path="/route_summary" element={<RouteSummary />} />
        <Route path="/alternate_airports" element={<AlternateAirports />} />


        <Route path="*" element={<p style={{ padding: '2rem' }}>Page not found.</p>} />
      </Routes>
    </BrowserRouter>
  );
}
