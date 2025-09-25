# Airline Database Flight Tracking Simulation
This project is an airline flight simulation app that models core airline operations including flights, routes, passengers, and bookings. It allows users to schedule flights, manage reservations, and simulate scenarios such as overbooking or delays, all while enforcing constraints through a database-backed system. The app is designed to replicate real-world airline processes and provides a platform for testing and analyzing scheduling and booking strategies in a controlled environment.

## Instructions to set up app:
To set up the app, first install Node.js and Python 3. Create a virtual environment and install the necessary dependencies (pip install -r requirements.txt). Then configure the .env file to your specific MySQL information, and set up the database/stored procedures by running the following instructions:

```bash
mysql -u root -p
> DROP DATABASE IF EXISTS flight_tracking;
> CREATE DATABASE flight_tracking;
> USE flight_tracking;
> EXIT;
mysql -u root -p flight_tracking < schema.sql
mysql -u root -p flight_tracking < procedures.sql
`````

Run npm install within our client folder in order to install all necessary dependencies.

## Instructions to run app:
To run the app, from the backend folder (‘cd server’), run ‘flask run’–a flask API server will be started on localhost:5002. Then run the app using python app.py. From the client folder (‘cd client’), run ‘npm start’, which will start up React on localhost:3000.

## Technologies:
Use React.js for our frontend UI, Flask for our backend API server, and MySQL as our relational database. Flask helped handle interacting with the database and routing requests. By creating forms and views using React, I incorporated each stored procedure into the frontend.
