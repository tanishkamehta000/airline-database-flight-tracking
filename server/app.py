import os
import datetime
import traceback

from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    'host': os.getenv('DB_HOST'), 'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASS'), 'database': os.getenv('DB_NAME'),  'cursorclass': pymysql.cursors.DictCursor
}

def get_db_connection():
    return pymysql.connect(**DB_CONFIG)

def serialize_rows(rows):

    for row in rows:
        for key, value in row.items():

            if isinstance(value, (datetime.time, datetime.timedelta)):

                row[key] = str(value)
    return rows

@app.route('/api/ping')
def ping():
    return jsonify({'message': 'pong'})


@app.route('/api/airplanes', methods=['POST'])
def add_airplane():

    data = request.json
    conn = get_db_connection()
    try:

        with conn.cursor() as cur:
            cur.callproc('add_airplane', [
                data['airlineID'], data['tail_num'], data['seat_capacity'],
                data['speed'],
                data['locationID'], data['plane_type'], data.get('maintenanced'), data.get('model'), data['neo']
            ])
            conn.commit()
        return jsonify({'status': 'success'}), 201
    
    except Exception as e:

        print("add_airplane error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    finally:

        conn.close()

@app.route('/api/airplanes', methods=['GET'])

def list_airplanes():

    conn = get_db_connection()

    try:

        with conn.cursor() as cur:
            cur.execute("select * from airplane")
            rows = cur.fetchall()
        return jsonify(rows), 200
    except Exception as e:
        print("list_airplanes error:", e)

        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/api/airports', methods=['POST'])

def add_airport():

    data = request.json
    conn = get_db_connection()

    try:
        with conn.cursor() as cur:
            cur.callproc('add_airport', [ data['airportID'], data['airport_name'], data['city'], data['state'],
                data['country'], data['locationID']
            ])
            conn.commit()

        return jsonify({'status': 'success'}), 201
    
    except Exception as e:
        print("add_airport error:", e)

        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    finally:
        conn.close()

@app.route('/api/airports', methods=['GET'])
def list_airports():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""select airportID, airport_name, city,state, country, locationID from airport""")

            rows = cur.fetchall()
        return jsonify(rows), 200
    
    except Exception as e:

        print("list_airports error:", e)

        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    finally:
        conn.close()


@app.route('/api/persons', methods=['POST'])
def add_person():
    data = request.json
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.callproc('add_person', [ data['personID'], data['first_name'], data.get('last_name'),
                data['locationID'], data.get('taxID'), data.get('experience'), data.get('miles'), data.get('funds')
            ])

            conn.commit()
        return jsonify({'status': 'success'}), 201
    except Exception as e:

        print("add_person error:", e)

        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:

        conn.close()

@app.route('/api/persons', methods=['GET'])
def list_persons():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                select p.personID, p.first_name, p.last_name, p.locationID,
                  pl.commanding_flight, pl.taxID, pl.experience, pa.miles, pa.funds from person p
                left join pilot pl using(personID)
                left join passenger pa using(personID)
            """)
            rows = cur.fetchall()
        return jsonify(rows), 200
    except Exception as e:
        print("list_persons() error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/api/passengers_board', methods=['POST'])
def passengers_board():
    data = request.json

    flightID = data.get('flightID')

    if not flightID:
        return jsonify({'error': 'Flight ID is required'}), 400

    conn = get_db_connection()
    try:

        with conn.cursor() as cur:
            cur.callproc('passengers_board', [flightID])
            conn.commit()

        return jsonify({'status': 'success'}), 200
    except Exception as e:
        print("passengers_board error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/passengers_disembark', methods=['POST'])
def passengers_disembark():

    data = request.json
    flightID = data.get('flightid')

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.callproc('passengers_disembark', [flightID])
            conn.commit()

        return jsonify({'status': 'success'}), 200
    except Exception as e:
        print("passengers_disembark error:", e)
        traceback.print_exc()

        return jsonify({'error': str(e)}), 500
    finally:

        conn.close()

@app.route('/api/pilot_licenses/toggle', methods=['POST'])
def toggle_pilot_license():
    data = request.json

    conn = get_db_connection()
    try:

        with conn.cursor() as cur:
            cur.callproc('grant_or_revoke_pilot_license', [data['personID'],
                data['license']])
            conn.commit()

        return jsonify({'status': 'toggled'}), 200
    except Exception as e:
        print("toggle_pilot_license error:", e)

        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    finally:
        conn.close()

@app.route('/api/pilot_licenses', methods=['GET'])
def list_pilot_licenses():
    conn = get_db_connection()

    try:
        with conn.cursor() as cur:
            cur.execute("select * from pilot_licenses")
            rows = serialize_rows(cur.fetchall())

        return jsonify(rows), 200
    except Exception as e:

        print("list_pilot_licenses error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    finally:
        conn.close()

@app.route('/api/recycle_crew', methods=['POST'])
def recycle_crew():
    data = request.json
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.callproc('recycle_crew', [ data['flightID'] ])
            conn.commit()
        return jsonify({'status':'success'}), 200
    except Exception as e:
        print("recycle_crew error:", e)
        return jsonify({'error':str(e)}), 400
    finally:
        conn.close()


@app.route('/api/offer_flight', methods=['POST'])

def offer_flight():
    data = request.json
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.callproc('offer_flight', [
                data['flightID'], data['routeID'], data.get('support_airline'),
                data.get('support_tail'), data['progress'],  data['next_time'],
                data['cost']
            ])

            conn.commit()

        return jsonify({'status': 'success'}), 201
    
    except Exception as e:
        print("offer_flight error:", e)

        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:

        conn.close()


@app.route('/api/flights', methods=['GET'])
def list_flights():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("select * from flight")

            rows = serialize_rows(cur.fetchall())
        return jsonify(rows), 200
    except Exception as e:

        print("list_flights error:", e)

        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:

        conn.close()


@app.route('/api/flight_landing', methods=['POST'])
def flight_landing():
    data = request.json
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.callproc('flight_landing', [data['flightID']])
            conn.commit()

        return jsonify({'status': 'landed'}), 200
    except Exception as e:
        print("flight_landing error:", e)

        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/api/flight_takeoff', methods=['POST'])
def flight_takeoff():

    data = request.json
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:

            cur.callproc('flight_takeoff', [data['flightID']])
            conn.commit()
        return jsonify({'status': 'takeoff'}), 200
    except Exception as e:
        print("flight_takeoff error:", e)

        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:

        conn.close()


@app.route('/api/flights_in_air', methods=['GET'])
def view_flights_in_air():

    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("select * from flights_in_the_air")
            rows = serialize_rows(cur.fetchall())

        return jsonify(rows), 200
    
    except Exception as e:
        print("flights_in_air error:", e)

        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    finally:
        conn.close()

@app.route('/api/flights_on_ground', methods=['GET'])
def view_flights_on_ground():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("select * from flights_on_the_ground")
            rows = serialize_rows(cur.fetchall())

        return jsonify(rows), 200
    
    except Exception as e:

        print("flights_on_ground error:", e)
        traceback.print_exc()

        return jsonify({'error': str(e)}), 500
    
    finally:
        conn.close()







@app.route('/api/people_in_air', methods=['GET'])
def view_people_in_air():
    conn = get_db_connection()
    try:

        with conn.cursor() as cur:
            cur.execute("select * from people_in_the_air")
            rows = serialize_rows(cur.fetchall())
        return jsonify(rows), 200
    
    except Exception as e:
        print("people_in_air error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
@app.route('/api/people_on_ground', methods=['GET'])
def view_people_on_ground():

    conn = get_db_connection()

    try:
        with conn.cursor() as cur:
            cur.execute("select * from people_on_the_ground")
            rows = serialize_rows(cur.fetchall())

        return jsonify(rows), 200
    
    except Exception as e:
        
        print("people_on_ground error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ── summary views ────────────────────────────────────────────

@app.route('/api/route_summary', methods=['GET'])

def view_route_summary():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:

            cur.execute("select * from route_summary")
            rows = serialize_rows(cur.fetchall())
        return jsonify(rows), 200
    
    except Exception as e:

        print("view_route_summary error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:

        conn.close()
@app.route('/api/alternate_airports', methods=['GET'])

def view_alternate_airports():
    conn = get_db_connection()
    try:

        with conn.cursor() as cur:

            cur.execute("select * from alternative_airports")
            rows = serialize_rows(cur.fetchall())

        return jsonify(rows), 200
    
    except Exception as e:

        print("view_alternate_airports error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    finally:

        conn.close()


@app.route('/api/retire_flight', methods=['POST'])
def retire_flight():
    data = request.json
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.callproc('retire_flight', [ data['flightID'] ])
            conn.commit()
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        print("retire_flight error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/api/assign_pilot', methods=['POST'])
def assign_pilot():
    data = request.json
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.callproc('assign_pilot', [
                data['flightID'],
                data['personID']
            ])
            conn.commit()
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        print("assign_pilot error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/api/simulation_cycle', methods=['POST'])
def simulation_cycle():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.callproc('simulation_cycle', [])
            conn.commit()
        return jsonify({'status':'success'}), 200
    except Exception as e:
        print("simulation_cycle error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()


if __name__ == '__main__':

    port = int(os.getenv('PORT', 5002))
    print("starting flask app on port", port)

    app.run(host='0.0.0.0', port=port, debug=True)
