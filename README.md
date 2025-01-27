## Setup Instructions

After cloning the repo, create two `.env` files in the root of the project:

1. `.env.development`
2. `.env.test`

In both files, add the following line, adjusting for the correct database name:

PGDATABASE=your_database_name_here
PGDATABASE=your_database_name_here + _test

You can find the database names in the db/setup.sql file.


Once these are setup you should be able to connect to the database and run the project.
