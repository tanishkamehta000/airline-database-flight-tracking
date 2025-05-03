# airline-database-flight-tracking

1. Instructions to setup your app
To set up the app, first install Node.js and Python 3. Create a virtual environment and install the necessary dependencies (pip install -r requirements.txt). Then configure the .env file to your specific MySQL information, and set up the database/stored procedures by running the following instructions:


```bash
mysql -u root -p
```sql
DROP DATABASE IF EXISTS flight_tracking;
CREATE DATABASE flight_tracking;
USE flight_tracking;
EXIT;
```bash
mysql -u root -p flight_tracking < schema.sql
mysql -u root -p flight_tracking < procedures.sql

Run npm install within our client folder in order to install all necessary dependencies.

2. Instructions to run your app
To run the app, from the backend folder (‘cd server’), run ‘flask run’–a flask API server will be started on localhost:5002. Then run the app using python app.py. From the client folder (‘cd client’), run ‘npm start’, which will start up React on localhost:3000.

3. Technologies:
Use React.js for our frontend UI, Flask for our backend API server, and MySQL as our relational database. Flask helped handle interacting with the database and routing requests. By creating forms and views using React, I incorporated each stored procedure into the frontend.
