-- CS4400: Introduction to Database Systems: Monday, March 3, 2025
-- Simple Airline Management System Course Project Mechanics [TEMPLATE] (v0)
-- Views, Functions & Stored Procedures

/* This is a standard preamble for most of our scripts.  The intent is to establish
a consistent environment for the database behavior. */
set global transaction isolation level serializable;
set global SQL_MODE = 'ANSI,TRADITIONAL';
set names utf8mb4;
set SQL_SAFE_UPDATES = 0;

use flight_tracking;
-- -----------------------------------------------------------------------------
-- stored procedures and views
-- -----------------------------------------------------------------------------
/* Standard Procedure: If one or more of the necessary conditions for a procedure to
be executed is false, then simply have the procedure halt execution without changing
the database state. Do NOT display any error messages, etc. */

-- [_] supporting functions, views and stored procedures
-- -----------------------------------------------------------------------------
/* Helpful library capabilities to simplify the implementation of the required
views and procedures. */
-- -----------------------------------------------------------------------------
drop function if exists leg_time;
delimiter //
create function leg_time (ip_distance integer, ip_speed integer)
	returns time reads sql data
begin
	declare total_time decimal(10,2);
    declare hours, minutes integer default 0;
    set total_time = ip_distance / ip_speed;
    set hours = truncate(total_time, 0);
    set minutes = truncate((total_time - hours) * 60, 0);
    return maketime(hours, minutes, 0);
end //
delimiter ;

-- [1] add_airplane()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new airplane.  A new airplane must be sponsored
by an existing airline, and must have a unique tail number for that airline.
username.  An airplane must also have a non-zero seat capacity and speed. An airplane
might also have other factors depending on it's type, like the model and the engine.  
Finally, an airplane must have a new and database-wide unique location
since it will be used to carry passengers. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_airplane;
delimiter //
create procedure add_airplane (in ip_airlineID varchar(50), in ip_tail_num varchar(50),
	in ip_seat_capacity integer, in ip_speed integer, in ip_locationID varchar(50),
    in ip_plane_type varchar(100), in ip_maintenanced boolean, in ip_model varchar(50),
    in ip_neo boolean)
sp_main: begin
	-- Ensure that the plane type is valid: Boeing, Airbus, or neither
    -- Ensure that the type-specific attributes are accurate for the type
    -- Ensure that the airplane and location values are new and unique
    -- Add airplane and location into respective tables
    
    if not exists (select 1 from Airline where airlineID = ip_airlineID) then 
		leave sp_main;
	end if;

    if exists (select 1 from Airplane where airlineID = ip_airlineID and tail_num = ip_tail_num) then
        leave sp_main;
    end if;

    if exists (select 1 from Location where locationID = ip_locationID) then
        leave sp_main;
    end if;
    
	if ip_plane_type not in ('Boeing', 'Airbus', 'Neither') then
        leave sp_main;
    end if;
    if ip_speed is null or ip_speed <= 0 or ip_seat_capacity is null or ip_seat_capacity <= 0 then
        leave sp_main;
    end if;

    if ip_plane_type = 'Airbus' and (ip_neo not in (0, 1)) then
        leave sp_main;
    end if;
    
    if ip_plane_type = 'General' and (ip_neo is not null and ip_neo != 0) then
        leave sp_main;
    end if;

    if ip_plane_type = 'Boeing' and (ip_model is null or ip_model <= 0 or ip_model = '') then
        leave sp_main;
    end if;

    if ip_plane_type = 'Neither' and (ip_model is not null and ip_model != 0 and ip_model != '') then
        leave sp_main;
    end if;

    insert into Location(locationID) values (ip_locationID);

    insert into Airplane (airlineID, tail_num, seat_capacity, speed, locationID, plane_type, maintenanced, model, neo) values (ip_airlineID, ip_tail_num, ip_seat_capacity, ip_speed, ip_locationID, ip_plane_type, ip_maintenanced, ip_model, ip_neo);

end //
delimiter ;

-- [2] add_airport()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new airport.  A new airport must have a unique
identifier along with a new and database-wide unique location if it will be used
to support airplane takeoffs and landings.  An airport may have a longer, more
descriptive name.  An airport must also have a city, state, and country designation. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_airport;
delimiter //
create procedure add_airport (in ip_airportID char(3), in ip_airport_name varchar(200),
    in ip_city varchar(100), in ip_state varchar(100), in ip_country char(3), in ip_locationID varchar(50))
sp_main: begin

	-- Ensure that the airport and location values are new and unique
    -- Add airport and location into respective tables
    if exists (select 1 from airport where airportID = ip_airportID) then
        leave sp_main;
    end if;
    
    if exists (select 1 from location where locationID = ip_locationID) then
        leave sp_main;
    end if;
    
    if ip_city is null or ip_state is null or ip_country is null then
        leave sp_main;
    end if;
    
    insert into location (locationID) values (ip_locationID);
    insert into airport (airportID, airport_name, city, state, country, locationID) values (ip_airportID, ip_airport_name, ip_city, ip_state, ip_country, ip_locationID);

end //
delimiter ;

-- [3] add_person()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new person.  A new person must reference a unique
identifier along with a database-wide unique location used to determine where the
person is currently located: either at an airport, or on an airplane, at any given
time.  A person must have a first name, and might also have a last name.

A person can hold a pilot role or a passenger role (exclusively).  As a pilot,
a person must have a tax identifier to receive pay, and an experience level.  As a
passenger, a person will have some amount of frequent flyer miles, along with a
certain amount of funds needed to purchase tickets for flights. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_person;
delimiter //
create procedure add_person (in ip_personID varchar(50), in ip_first_name varchar(100),
    in ip_last_name varchar(100), in ip_locationID varchar(50), in ip_taxID varchar(50),
    in ip_experience integer, in ip_miles integer, in ip_funds integer)
sp_main: begin

	-- Ensure that the location is valid
    -- Ensure that the persion ID is unique
    -- Ensure that the person is a pilot or passenger
    -- Add them to the person table as well as the table of their respective role
    
    if exists (select 1 from person where personID = ip_personID) then
        leave sp_main;
    end if;
    
    if not exists (select 1 from location where locationID = ip_locationID) then
        leave sp_main;
    end if;
    
    if ip_first_name is null then
        leave sp_main;
    end if;
    
    if (ip_taxID is not null and ip_experience is not null and ip_miles is null and ip_funds is null) then
        insert into person (personID, first_name, last_name, locationID) values (ip_personID, ip_first_name, ip_last_name, ip_locationID);
        insert into pilot (personID, taxID, experience) values (ip_personID, ip_taxID, ip_experience);
        
    elseif (ip_taxID is null and ip_experience is null and ip_miles is not null and ip_funds is not null) then
        insert into person (personID, first_name, last_name, locationID) values (ip_personID, ip_first_name, ip_last_name, ip_locationID);
        insert into passenger (personID, miles, funds) values (ip_personID, ip_miles, ip_funds);
        
    else leave sp_main;
    
    end if;

end //
delimiter ;

-- [4] grant_or_revoke_pilot_license()
-- -----------------------------------------------------------------------------
/* This stored procedure inverts the status of a pilot license.  If the license
doesn't exist, it must be created; and, if it aready exists, then it must be removed. */
-- -----------------------------------------------------------------------------
drop procedure if exists grant_or_revoke_pilot_license;
delimiter //
create procedure grant_or_revoke_pilot_license (in ip_personID varchar(50), in ip_license varchar(100))
sp_main: begin

	-- Ensure that the person is a valid pilot
    -- If license exists, delete it, otherwise add the license
    
    if not exists (select 1 from pilot where personid = ip_personid) then
        leave sp_main;
    end if;

    if exists (select 1 from pilot_licenses where personid = ip_personid and license = ip_license) then
        delete from pilot_licenses where personid = ip_personid and license = ip_license;
        leave sp_main;
    end if;

    insert into pilot_licenses (personid, license) values (ip_personid, ip_license);

end //
delimiter ;

-- [5] offer_flight()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new flight.  The flight can be defined before
an airplane has been assigned for support, but it must have a valid route.  And
the airplane, if designated, must not be in use by another flight.  The flight
can be started at any valid location along the route except for the final stop,
and it will begin on the ground.  You must also include when the flight will
takeoff along with its cost. */
-- -----------------------------------------------------------------------------
drop procedure if exists offer_flight;
delimiter //
create procedure offer_flight (in ip_flightID varchar(50), in ip_routeID varchar(50),
    in ip_support_airline varchar(50), in ip_support_tail varchar(50), in ip_progress integer,
    in ip_next_time time, in ip_cost integer)
sp_main: begin

	-- Ensure that the airplane exists
    -- Ensure that the route exists
    -- Ensure that the progress is less than the length of the route
    -- Create the flight with the airplane starting in on the ground
    
    if exists (select 1 from flight where flightID = ip_flightID) then
        leave sp_main;
    end if;
    
    if not exists (select 1 from route where routeID = ip_routeID) then
        leave sp_main;
    end if;
    
    if ip_progress >= (select count(*) from route_path where routeID = ip_routeID) then
        leave sp_main;
    end if;
    
    if ip_support_airline is not null and ip_support_tail is not null then
        if not exists (select 1 from airplane where airlineID = ip_support_airline and tail_num = ip_support_tail) then
            leave sp_main;
        end if;
        
        if exists (select 1 from flight where support_airline = ip_support_airline and support_tail = ip_support_tail) then
            leave sp_main;
        end if;
        
    end if;
    
    insert into flight (flightID, routeID, support_airline, support_tail, progress, airplane_status, next_time, cost) values (ip_flightID, ip_routeID, ip_support_airline, ip_support_tail,ip_progress, 'on_ground', ip_next_time, ip_cost);

end //
delimiter ;

-- [6] flight_landing()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for a flight landing at the next airport
along it's route.  The time for the flight should be moved one hour into the future
to allow for the flight to be checked, refueled, restocked, etc. for the next leg
of travel.  Also, the pilots of the flight should receive increased experience, and
the passengers should have their frequent flyer miles updated. */
-- -----------------------------------------------------------------------------
drop procedure if exists flight_landing;
delimiter //
create procedure flight_landing (in ip_flightID varchar(50))
sp_main: begin

	-- Ensure that the flight exists
    -- Ensure that the flight is in the air
    
    -- Increment the pilot's experience by 1
    -- Increment the frequent flyer miles of all passengers on the plane
    -- Update the status of the flight and increment the next time to 1 hour later
		-- Hint: use addtime()
        
	if not exists (select flightID from flight where flightID  = ip_flightID) then
        leave sp_main;
	end if;
    
    if ( (select airplane_status from flight where flightID = ip_flightID) != 'in_flight') then 
        leave sp_main;
	end if;
    
    update pilot
    set experience = experience + 1
    where commanding_flight = (select flightID from flight where flightID = ip_flightID);
	
    update passenger pa join person pe on pa.personID = pe.personID
	join airplane a on pe.locationID = a.locationID
	join flight f on a.tail_num = f.support_tail
	join route_path r on f.routeID = r.routeID
	join leg l on r.legID = l.legID set pa.miles  = pa.miles + l.distance where f.progress = r.sequence and f.flightID = ip_flightID;
    
    update flight set airplane_status = 'on_ground', next_time = addtime(next_time, '1:00') where flightID = ip_flightID;

end //
delimiter ;

-- [7] flight_takeoff()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for a flight taking off from its current
airport towards the next airport along it's route.  The time for the next leg of
the flight must be calculated based on the distance and the speed of the airplane.
And we must also ensure that Airbus and general planes have at least one pilot
assigned, while Boeing must have a minimum of two pilots. If the flight cannot take
off because of a pilot shortage, then the flight must be delayed for 30 minutes. */
-- -----------------------------------------------------------------------------
drop procedure if exists flight_takeoff;
delimiter //
create procedure flight_takeoff (in ip_flightID varchar(50))
sp_main: begin

	-- Ensure that the flight exists
    -- Ensure that the flight is on the ground
    -- Ensure that the flight has another leg to fly
    -- Ensure that there are enough pilots (1 for Airbus and general, 2 for Boeing)
		-- If there are not enough, move next time to 30 minutes later
        
	-- Increment the progress and set the status to in flight
    -- Calculate the flight time using the speed of airplane and distance of leg
    -- Update the next time using the flight time
    declare v_distance    int;
  declare v_plane_type  varchar(100);
  declare v_num_pilots  int;
  declare v_speed       int;
  declare v_flight_time time;

  if not exists(select 1 from flight where flightid=ip_flightid and airplane_status='on_ground') then leave sp_main; end if;
  if exists(select 1 from flight f where f.flightid=ip_flightid and f.progress >= (select count(*) from route_path where routeid=f.routeid)) then leave sp_main; end if;

  select a.plane_type, count(p.personid) into v_plane_type, v_num_pilots
    from flight f
    join airplane a on f.support_airline=a.airlineid and f.support_tail=a.tail_num
    left join pilot p on p.commanding_flight=f.flightid
   where f.flightid=ip_flightid
   group by a.plane_type;

  if (v_plane_type='boeing' and v_num_pilots<2) or ((v_plane_type='airbus' or v_plane_type is null) and v_num_pilots<1) then update flight set next_time=addtime(next_time,'00:30:00') where flightid=ip_flightid; leave sp_main; end if;

  select l.distance, a.speed into v_distance, v_speed
    from flight f
    join route_path rp on f.routeid=rp.routeid and rp.sequence=f.progress+1
    join leg l on rp.legid=l.legid
    join airplane a on f.support_airline=a.airlineid and f.support_tail=a.tail_num
   where f.flightid=ip_flightid;

  set v_flight_time=leg_time(v_distance,v_speed);

  update flight set airplane_status='in_flight', progress=progress+1, next_time=addtime(next_time,v_flight_time)
   where flightid=ip_flightid;
end //
delimiter ;



-- [8] passengers_board()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for passengers getting on a flight at
its current airport.  The passengers must be at the same airport as the flight,
and the flight must be heading towards that passenger's desired destination.
Also, each passenger must have enough funds to cover the flight.  Finally, there
must be enough seats to accommodate all boarding passengers. */
-- -----------------------------------------------------------------------------
drop procedure if exists passengers_board;
delimiter //
create procedure passengers_board (in ip_flightID varchar(50))
sp_main: begin

	-- Ensure the flight exists
    -- Ensure that the flight is on the ground
    -- Ensure that the flight has further legs to be flown
    
    -- Determine the number of passengers attempting to board the flight
    -- Use the following to check:
		-- The airport the airplane is currently located at
        -- The passengers are located at that airport
        -- The passenger's immediate next destination matches that of the flight
        -- The passenger has enough funds to afford the flight
        
	-- Check if there enough seats for all the passengers
		-- If not, do not add board any passengers
        -- If there are, board them and deduct their funds
        
	declare v_current_airport char(3);
  declare v_next_airport char(3);
  declare v_airplane_location varchar(50);
  declare v_flight_cost int;
  declare v_seats_available int;
  declare v_eligible_passengers int;

  if not exists(
    select 1
      from flight
     where flightid=ip_flightid
       and airplane_status='on_ground'
  ) then leave sp_main; end if;

  if exists(
    select 1
      from flight f
      join route_path r on f.routeid=r.routeid
     where f.flightid=ip_flightid
       and f.progress >= (
         select count(*)-1
           from route_path
          where routeid=f.routeid
       )
  ) then leave sp_main; end if;

  select result into v_current_airport from (
    select l.departure as result
      from flight f
      join route_path r on r.routeid=f.routeid
      join leg l on r.legid=l.legid
     where f.flightid=ip_flightid
       and f.progress=0
       and r.sequence=1
    union
    select l.arrival
      from flight f
      join route_path r on r.routeid=f.routeid
      join leg l on r.legid=l.legid
     where f.flightid=ip_flightid
       and f.progress!=0
       and r.sequence=f.progress
  ) as sub;

  select a.locationid into v_airplane_location
    from flight f
    join airplane a on f.support_airline=a.airlineid and f.support_tail=a.tail_num
   where f.flightid=ip_flightid;

  select l.arrival into v_next_airport
    from flight f
    join route_path rp on f.routeid=rp.routeid and rp.sequence=f.progress+1
    join leg l on rp.legid=l.legid
   where f.flightid=ip_flightid;

  select cost into v_flight_cost
    from flight
   where flightid=ip_flightid;

  select a.seat_capacity-count(p.personid) into v_seats_available
    from airplane a
    left join person p on a.locationid=p.locationid
    join flight f on f.support_airline=a.airlineid and f.support_tail=a.tail_num
   where f.flightid=ip_flightid
   group by a.seat_capacity;

  select count(*) into v_eligible_passengers
    from person p
    join passenger pa on p.personid=pa.personid
    join airport ap on p.locationid=ap.locationid
   where ap.airportid=v_current_airport
     and exists(
       select 1
         from passenger_vacations pv
        where pv.personid=p.personid
          and pv.airportid=v_next_airport
          and pv.sequence=(
            select min(sequence)
              from passenger_vacations
             where personid=p.personid
          )
     )
     and pa.funds>=v_flight_cost;

  if v_seats_available>=v_eligible_passengers
     and v_eligible_passengers>0
  then
    create temporary table if not exists eligible_boarding_passengers(personid varchar(50));
    delete from eligible_boarding_passengers;

    insert into eligible_boarding_passengers
      select p.personid
        from person p
        join passenger pa on p.personid=pa.personid
        join airport ap on p.locationid=ap.locationid
       where ap.airportid=v_current_airport
         and exists(
           select 1
             from passenger_vacations pv
            where pv.personid=p.personid
              and pv.airportid=v_next_airport
              and pv.sequence=(
                select min(sequence)
                  from passenger_vacations
                 where personid=p.personid
              )
         )
         and pa.funds>=v_flight_cost;

    update passenger pa
      join eligible_boarding_passengers ep on pa.personid=ep.personid
       set pa.funds=pa.funds-v_flight_cost;

    update person p
      join eligible_boarding_passengers ep on p.personid=ep.personid
       set p.locationid=v_airplane_location;
  end if;

end //
delimiter ;

-- [9] passengers_disembark()
-- -----------------------------------------------------------------------------
/* This stored procedure updates the state for passengers getting off of a flight
at its current airport.  The passengers must be on that flight, and the flight must
be located at the destination airport as referenced by the ticket. */
-- -----------------------------------------------------------------------------
drop procedure if exists passengers_disembark;
delimiter //
create procedure passengers_disembark (in ip_flightID varchar(50))
sp_main: begin

	-- Ensure the flight exists
    -- Ensure that the flight is in the air
    
    -- Determine the list of passengers who are disembarking
	-- Use the following to check:
		-- Passengers must be on the plane supporting the flight
        -- Passenger has reached their immediate next destionation airport
        
	-- Move the appropriate passengers to the airport
    -- Update the vacation plans of the passengers
    
    declare v_arrival_airport char(3);
    declare v_airport_location varchar(50);
    
    if not exists (select 1 from flight where flightID = ip_flightID and airplane_status = 'on_ground') then
        leave sp_main;
    end if;
    
    select l.arrival, a2.locationID into v_arrival_airport, v_airport_location from flight f
    join route_path rp on f.routeID = rp.routeID and rp.sequence = f.progress
    join leg l on rp.legID = l.legID
    join airport a2 on l.arrival = a2.airportID where f.flightID = ip_flightID;
    
    update person p join passenger_vacations pv on p.personID = pv.personID
    join airplane a on p.locationID = a.locationID
    join flight f on f.support_airline = a.airlineID and f.support_tail = a.tail_num set p.locationID = v_airport_location where f.flightID = ip_flightID and pv.airportID = v_arrival_airport;
    
    delete pv from passenger_vacations pv join person p on pv.personID = p.personID
    join airplane a on p.locationID = a.locationID
    join flight f on f.support_airline = a.airlineID and f.support_tail = a.tail_num where f.flightID = ip_flightID and pv.airportID = v_arrival_airport;

end //
delimiter ;


-- [10] assign_pilot()
-- -----------------------------------------------------------------------------
/* This stored procedure assigns a pilot as part of the flight crew for a given
flight.  The pilot being assigned must have a license for that type of airplane,
and must be at the same location as the flight.  Also, a pilot can only support
one flight (i.e. one airplane) at a time.  The pilot must be assigned to the flight
and have their location updated for the appropriate airplane. */
-- -----------------------------------------------------------------------------
drop procedure if exists assign_pilot;
delimiter //
create procedure assign_pilot (in ip_flightID varchar(50), ip_personID varchar(50))
sp_main: begin

	-- Ensure the flight exists
    -- Ensure that the flight is on the ground
    -- Ensure that the flight has further legs to be flown
    
    -- Ensure that the pilot exists and is not already assigned
	-- Ensure that the pilot has the appropriate license
    -- Ensure the pilot is located at the airport of the plane that is supporting the flight
    
    -- Assign the pilot to the flight and update their location to be on the plane
    
    declare v_departure_airport char(3);
    declare v_airport_location varchar(50);
    if not exists (select 1 from flight where flightID = ip_flightID and airplane_status = 'on_ground') then
        leave sp_main;
    end if;
    
    select sub.departure_airport, a2.locationID into v_departure_airport, v_airport_location from (
		select l.departure as departure_airport from flight f join route_path rp on rp.routeID = f.routeID
		join leg l on rp.legID = l.legID where f.flightID = ip_flightID and f.progress = 0 and rp.sequence = 1
		union
		select l.arrival from flight f join route_path rp on rp.routeID = f.routeID join leg l on rp.legID = l.legID
		where f.flightID = ip_flightID and f.progress != 0 and rp.sequence = f.progress
	) as sub
	join flight f on f.flightID = ip_flightID join airplane a2 on f.support_airline = a2.airlineID and f.support_tail = a2.tail_num;

    
    if exists (select 1 from flight f where f.flightID = ip_flightID and f.progress >= (select count(*) from route_path where routeID = f.routeID) - 1) then
        leave sp_main;
    end if;
    
    if not exists (select 1 from pilot where personID = ip_personID and commanding_flight is null) then
        leave sp_main;
    end if;
    
    if not exists (select 1 from pilot_licenses pl join flight f on f.flightID = ip_flightID join airplane a on f.support_airline = a.airlineID and f.support_tail = a.tail_num where pl.personID = ip_personID and pl.license = a.plane_type) then
		leave sp_main;
    end if;
    
    if not exists (select 1 from person p join airport a on p.locationID = a.locationID where p.personID = ip_personID and a.airportID = v_departure_airport) then
        leave sp_main;
    end if;
    
    update pilot set commanding_flight = ip_flightID where personID = ip_personID;
    update person set locationID = v_airport_location where personID = ip_personID;

end //
delimiter ;
-- [11] recycle_crew()
-- -----------------------------------------------------------------------------
/* This stored procedure releases the assignments for a given flight crew.  The
flight must have ended, and all passengers must have disembarked. */
-- -----------------------------------------------------------------------------
drop procedure if exists recycle_crew;
delimiter //
create procedure recycle_crew (in ip_flightID varchar(50))
sp_main: begin

	-- Ensure that the flight is on the ground
    -- Ensure that the flight does not have any more legs
    
    -- Ensure that the flight is empty of passengers
    
    -- Update assignements of all pilots
    -- Move all pilots to the airport the plane of the flight is located at
    
    if not exists (select 1 from flight where flightID = ip_flightID and airplane_status = 'on_ground') then
        leave sp_main;
    end if;
    
    if exists (select 1 from flight f join route_path rp on f.routeID = rp.routeID where f.flightID = ip_flightID and f.progress < (select count(*) - 1 from route_path where routeID = f.routeID)) then
        leave sp_main;
    end if;
    
    if exists (select 1 from person p join passenger ps on p.personID = ps.personID join airplane a on p.locationID = a.locationID join flight f on f.support_airline = a.airlineID and f.support_tail = a.tail_num where f.flightID = ip_flightID) then
        leave sp_main;
    end if;
    
    set @airport_locationID = (select ap.locationID from flight f 
    join route_path rp on f.routeID = rp.routeID and rp.sequence = f.progress 
    join leg l on rp.legID = l.legID 
    join airport ap on l.arrival = ap.airportID where f.flightID = ip_flightID);
    
    if @airport_locationID is null then 
		set @airport_locationID = (select ap.locationID from flight f
		join route_path rp on f.routeID = rp.routeID and rp.sequence = 1
		join leg l on rp.legID = l.legID
		join airport ap on l.departure = ap.airportID where f.flightID = ip_flightID);
    end if;
    
    update person set locationID = @airport_locationID where personID in (select personID from pilot where commanding_flight = ip_flightID);
    
    update pilot set commanding_flight = NULL where commanding_flight = ip_flightID;

end //
delimiter ;

-- [12] retire_flight()
-- -----------------------------------------------------------------------------
/* This stored procedure removes a flight that has ended from the system.  The
flight must be on the ground, and either be at the start its route, or at the
end of its route.  And the flight must be empty - no pilots or passengers. */
-- -----------------------------------------------------------------------------
drop procedure if exists retire_flight;
delimiter //
create procedure retire_flight (in ip_flightID varchar(50))
sp_main: begin

	-- Ensure that the flight is on the ground
    -- Ensure that the flight does not have any more legs
    
    -- Ensure that there are no more people on the plane supporting the flight
    
    -- Remove the flight from the system
    
    declare v_routeid varchar(50);
    declare v_progress integer;

    if not exists (select 1 from flight where flightid = ip_flightid and airplane_status = 'on_ground') then
        leave sp_main;
    end if;

    select routeid, progress into v_routeid, v_progress from flight where flightid = ip_flightid;

    if v_progress != 0 and v_progress != (select count(*) from route_path where routeid = v_routeid) then
        leave sp_main;
    end if;

    if exists (select 1 from pilot where commanding_flight = ip_flightid) then
        leave sp_main;
    end if;

    if exists (select 1 from person p join airplane a on p.locationid = a.locationid join flight f on f.support_airline = a.airlineid and f.support_tail = a.tail_num where f.flightid = ip_flightid) then
        leave sp_main;
    end if;

    delete from flight
    where flightid = ip_flightid;

end //
delimiter ;

-- [13] simulation_cycle()
-- -----------------------------------------------------------------------------
/* This stored procedure executes the next step in the simulation cycle.  The flight
with the smallest next time in chronological order must be identified and selected.
If multiple flights have the same time, then flights that are landing should be
preferred over flights that are taking off.  Similarly, flights with the lowest
identifier in alphabetical order should also be preferred.

If an airplane is in flight and waiting to land, then the flight should be allowed
to land, passengers allowed to disembark, and the time advanced by one hour until
the next takeoff to allow for preparations.

If an airplane is on the ground and waiting to takeoff, then the passengers should
be allowed to board, and the time should be advanced to represent when the airplane
will land at its next location based on the leg distance and airplane speed.

If an airplane is on the ground and has reached the end of its route, then the
flight crew should be recycled to allow rest, and the flight itself should be
retired from the system. */
-- -----------------------------------------------------------------------------
drop procedure if exists simulation_cycle;
delimiter //
create procedure simulation_cycle ()
sp_main: begin

	-- Identify the next flight to be processed
    
    -- If the flight is in the air:
		-- Land the flight and disembark passengers
        -- If it has reached the end:
			-- Recycle crew and retire flight
            
	-- If the flight is on the ground:
		-- Board passengers and have the plane takeoff
        
	-- Hint: use the previously created procedures
    
    declare v_flightID varchar(50);
    declare v_routeID varchar(50);
    declare v_progress integer;
    declare v_status varchar(100);
    declare v_total_legs integer;

    select f.flightID, f.routeID, f.progress, f.airplane_status, (select count(*) from route_path where routeID = f.routeID) as total_legs into v_flightID, v_routeID, v_progress, v_status, v_total_legs
	from flight f where f.next_time = (select min(next_time) from flight) order by (f.airplane_status != 'in_flight'), f.flightID limit 1;

    if v_flightID is null then
        leave sp_main;
    end if;

    if v_status = 'in_flight' then
        call flight_landing(v_flightID);
        call passengers_disembark(v_flightID);
        
        select f.progress, (select count(*) from route_path where routeID = f.routeID) into v_progress, v_total_legs from flight f where f.flightID = v_flightID;
        
        if v_progress >= v_total_legs - 1 then
            call recycle_crew(v_flightID);
            call retire_flight(v_flightID);
        end if;
    
    elseif v_status = 'on_ground' then
        if v_progress >= v_total_legs - 1 then
            call recycle_crew(v_flightID);
            call retire_flight(v_flightID);
        else
            call passengers_board(v_flightID);
            call flight_takeoff(v_flightID);
        end if;
    end if;

end //
delimiter ;

-- [14] flights_in_the_air()
-- -----------------------------------------------------------------------------
/* This view describes where flights that are currently airborne are located. 
We need to display what airports these flights are departing from, what airports 
they are arriving at, the number of flights that are flying between the 
departure and arrival airport, the list of those flights (ordered by their 
flight IDs), the earliest and latest arrival times for the destinations and the 
list of planes (by their respective flight IDs) flying these flights. */
-- -----------------------------------------------------------------------------
create or replace view flights_in_the_air (departing_from, arriving_at, num_flights,
	flight_list, earliest_arrival, latest_arrival, airplane_list) as
select l.departure, l.arrival, count(*) as num_flights, group_concat(f.flightid order by f.flightid) as flight_list, min(f.next_time) as earliest_arrival, max(f.next_time) as latest_arrival, group_concat(a.locationid order by f.flightid) as airplane_list
from flight f join route_path rp on f.routeid = rp.routeid and rp.sequence = f.progress join leg l on rp.legid = l.legid
join airplane a on f.support_airline = a.airlineid and f.support_tail = a.tail_num where f.airplane_status = 'in_flight' group by l.departure, l.arrival;



-- [15] flights_on_the_ground()
-- ------------------------------------------------------------------------------
/* This view describes where flights that are currently on the ground are 
located. We need to display what airports these flights are departing from, how 
many flights are departing from each airport, the list of flights departing from 
each airport (ordered by their flight IDs), the earliest and latest arrival time 
amongst all of these flights at each airport, and the list of planes (by their 
respective flight IDs) that are departing from each airport.*/
-- ------------------------------------------------------------------------------
create or replace view flights_on_the_ground (departing_from, num_flights,
	flight_list, earliest_arrival, latest_arrival, airplane_list) as 
select 

if(f.progress = 0, (select l.departure from route_path rp join leg l on rp.legid = l.legid where rp.routeid = f.routeid and rp.sequence = 1),
(select l.arrival from route_path rp join leg l on rp.legid = l.legid where rp.routeid = f.routeid and rp.sequence = f.progress)) as departing_from,

count(*) as num_flights, group_concat(f.flightid order by f.flightid) as flight_list, min(f.next_time) as earliest_arrival, max(f.next_time) as latest_arrival,
group_concat((select a.locationid from airplane a where a.airlineid = f.support_airline and a.tail_num = f.support_tail) order by f.flightid) as airplane_list

from flight f where f.airplane_status = 'on_ground' group by departing_from;


-- [16] people_in_the_air()
-- -----------------------------------------------------------------------------
/* This view describes where people who are currently airborne are located. We 
need to display what airports these people are departing from, what airports 
they are arriving at, the list of planes (by the location id) flying these 
people, the list of flights these people are on (by flight ID), the earliest 
and latest arrival times of these people, the number of these people that are 
pilots, the number of these people that are passengers, the total number of 
people on the airplane, and the list of these people by their person id. */
-- -----------------------------------------------------------------------------
create or replace view people_in_the_air (departing_from, arriving_at, num_airplanes,
	airplane_list, flight_list, earliest_arrival, latest_arrival, num_pilots,
	num_passengers, joint_pilots_passengers, person_list) as
select l.departure, l.arrival, count(distinct a.locationid) as num_airplanes, group_concat(distinct a.locationid order by a.locationid asc) as airplane_list, group_concat(distinct f.flightid order by f.flightid) as flight_list,
min(f.next_time) as earliest_arrival, max(f.next_time) as latest_arrival, sum(if(p.personid in (select personid from pilot), 1, 0)) as num_pilots, sum(if(p.personid in (select personid from passenger), 1, 0)) as num_passengers,
count(distinct p.personid) as joint_pilots_passengers, group_concat(distinct p.personid order by p.personid) as person_list

from person p join airplane a on p.locationid = a.locationid
join flight f on f.support_airline = a.airlineid and f.support_tail = a.tail_num
join route_path rp on f.routeid = rp.routeid and f.progress = rp.sequence
join leg l on rp.legid = l.legid where f.airplane_status = 'in_flight' group by l.departure, l.arrival;

-- [17] people_on_the_ground()
-- -----------------------------------------------------------------------------
/* This view describes where people who are currently on the ground and in an 
airport are located. We need to display what airports these people are departing 
from by airport id, location id, and airport name, the city and state of these 
airports, the number of these people that are pilots, the number of these people 
that are passengers, the total number people at the airport, and the list of 
these people by their person id. */
-- -----------------------------------------------------------------------------
create or replace view people_on_the_ground (departing_from, airport, airport_name,
	city, state, country, num_pilots, num_passengers, joint_pilots_passengers, person_list) as
select a.airportid as departing_from, a.locationid as airport, a.airport_name, a.city, a.state, a.country, sum(if(p.personid in (select personid from pilot), 1, 0)) as num_pilots,
sum(if(p.personid in (select personid from passenger), 1, 0)) as num_passengers, count(distinct p.personid) as joint_pilots_passengers, group_concat(distinct p.personid order by p.personid) as person_list

from person p join airport a on p.locationid = a.locationid group by a.airportid, a.locationid, a.airport_name, a.city, a.state, a.country;

-- [18] route_summary()
-- -----------------------------------------------------------------------------
/* This view will give a summary of every route. This will include the routeID, 
the number of legs per route, the legs of the route in sequence, the total 
distance of the route, the number of flights on this route, the flightIDs of 
those flights by flight ID, and the sequence of airports visited by the route. */
-- -----------------------------------------------------------------------------
create or replace view route_summary (route, num_legs, leg_sequence, route_length,
	num_flights, flight_list, airport_sequence) as
select rp.routeid as route, count(rp.legid) as num_legs, group_concat(rp.legid order by rp.sequence) as leg_sequence, sum(l.distance) as route_length, (select count(*) from flight f where f.routeid = rp.routeid) as num_flights,
(select group_concat(f.flightid order by f.flightid) from flight f where f.routeid = rp.routeid) as flight_list, group_concat(concat(l.departure, '->', l.arrival) order by rp.sequence) as airport_sequence

from route_path rp join leg l on rp.legid = l.legid group by rp.routeid;

-- [19] alternative_airports()
-- -----------------------------------------------------------------------------
/* This view displays airports that share the same city and state. It should 
specify the city, state, the number of airports shared, and the lists of the 
airport codes and airport names that are shared both by airport ID. */
-- -----------------------------------------------------------------------------
create or replace view alternative_airports (city, state, country, num_airports,
	airport_code_list, airport_name_list) as
select city, state, country, count(*) as num_airports, group_concat(airportID order by airportID separator ', ') as airport_code_list, group_concat(airport_name order by airportID separator ', ') as airport_name_list

from airport group by city, state, country having count(*) > 1;


