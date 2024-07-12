# Files Manager

## Intro
This File Manager software is a simple platform designed to upload and view files. It utilizes the following for a safe interactions and manipulations:
-  User Authentication
-  CRUD Actions
-  Permissions
-  Image Thumbnail Generation

This project is created during the back-end curriculum of Atlas School.


## Repository Structure
```
[Package/Env Configs]
utils/
    redis.js
    db.js
routes/
    index.js
controllers/
    AppController.js
    UsersController.js
    AuthController.js
    FilesController.js
tests/
    redis.test.js
    db.test.js
    index.test.js
```


### Individual Component Function

#### Package and Environment Config Files

`package.json`
- Configures dependencies and services to be used by Npm

`package-lock.json`
- Records exact versions of depency ranges for Npm

`babel.config.js`
- Babel configuration file for JavaScript code conversion for compatibility

`.eslintrc.js`
- ESLint configuration file for linting purposes

&nbsp;

#### Entry Point: `server.js`
- Uses Express to establish a live server connection. Serves as entry point and gathers information, environment variables, and curling data. Uses as the main server and interaction point for users.

&nbsp;

#### utils/

`redis.js`
- Creates a client for a Redis Connection. Serves as storage for User Authentication services by `express.js`. The `RedisClient` class features methods to determine the connection status to Redis, as well as Redis value CRUD operations. 

`db.js`
- Creates a client to *MongoDB* and secures a connection. Serves as data storage and interaction for File Management operations by `express.js`. The `DBClient` class features methods to determine the connection status to MongoDB, as well as the database's collection tracking operations.

#### controllers/

`AppController.js`
- Gives functionality to the endpoints:
```
GET /status
GET /stats
```
- Checks to see if the connection to Redis and DB is alive, as well as returning the number of users and files in their respective collections in the DB.

`Controller.js`
- Gives functionality to the endpoints:
```
GET /status
GET /stats
```
- Checks to see if the connection to Redis and DB is alive, as well as returning the number of users and files in their respective collections in the DB.
