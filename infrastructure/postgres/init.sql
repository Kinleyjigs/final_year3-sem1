-- PostgreSQL Initialization Script
-- Creates schemas for each microservice in the shared database

-- Auth Service Schema
CREATE SCHEMA IF NOT EXISTS auth;
COMMENT ON SCHEMA auth IS 'Auth Service: User authentication and authorization';

-- Grounds Service Schema
CREATE SCHEMA IF NOT EXISTS grounds;
COMMENT ON SCHEMA grounds IS 'Grounds Service: Football ground management';

-- Bookings Service Schema
CREATE SCHEMA IF NOT EXISTS bookings;
COMMENT ON SCHEMA bookings IS 'Booking Service: Booking reservations and management';

-- Maintenance Service Schema
CREATE SCHEMA IF NOT EXISTS maintenance;
COMMENT ON SCHEMA maintenance IS 'Maintenance Service: Ground maintenance scheduling';

-- Notifications Service Schema
CREATE SCHEMA IF NOT EXISTS notifications;
COMMENT ON SCHEMA notifications IS 'Notification Service: Email notifications';

-- Grant privileges to osb_user
GRANT ALL PRIVILEGES ON SCHEMA auth TO osb_user;
GRANT ALL PRIVILEGES ON SCHEMA grounds TO osb_user;
GRANT ALL PRIVILEGES ON SCHEMA bookings TO osb_user;
GRANT ALL PRIVILEGES ON SCHEMA maintenance TO osb_user;
GRANT ALL PRIVILEGES ON SCHEMA notifications TO osb_user;

-- Ensure default search path includes all schemas
ALTER DATABASE one_stop_book SET search_path TO public,auth,grounds,bookings,maintenance,notifications;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
COMMENT ON EXTENSION "uuid-ossp" IS 'UUID generation functions';
