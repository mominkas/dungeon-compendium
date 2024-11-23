## Backend

- Set up your .env file with credentials and details (see below) for connecting to your db on the postgres server
- No need to create a db manually, running the backend does it for you to streamline the process
- Use `nodemon server` to start up the backend and connect to the db
- Example .env file:\
  USER_NAME=postgres\
  PASSWORD=postgres\
  HOST=localhost\
  PORT=5432\
  DATABASE=dnd

## Scripts

- To create tables for the db, run the createTables.sql script using the following command in the terminal: `psql -U [your username] -d [db name] -f [path to createTables.sql in the sql-scripts folder]`
- To insert data into the tables, run insertData.sql

## Frontend

- Use `npm run dev` to start up frontend