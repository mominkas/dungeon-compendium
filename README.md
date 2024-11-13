## Backend

- setup your env file with credentails and details for connecting to your db on the postgres server
- no need to create a db manually, running the backend does it for you to streamline the process
- use 'nodemon server' to startup the backend and connect to the db

## Scripts

- To create tables for the db, run the createTables script using the follwing command in the temrinal: psql -U (you username) -d (db name) -f (path to createTables.sql in the sql-scripts folder)
- To run the insertData script, follow the above.
