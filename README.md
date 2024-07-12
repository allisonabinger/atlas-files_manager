# Files Manager - A Simple Platform for File and User Data Management

## Intro
This File Manager software is a simple platform designed to upload and view files. It utilizes the following for a safe interactions and manipulations:
-  User Authentication
-  CRUD Actions
-  Permissions
-  Image Thumbnail Generation

---

## Usage
This program uses Npm as a package manager. The node_modules have been explicity left out of this version. To use the file manager software, you must run `npm i` in the root of the repository to initialize all services and dependencies. 

This software is still in development and lacks a front-end user experience, but can be use on a command-line using `curl` to access the server. 

### Initialize the Server

After running `npm i` in the root of the repository, run `npm run start-server` to start the Express server and entry point. This is an example of what your output should resemble:

:warning: INSERT EXAMPLE OUTCOME HERE :warning:

<table><tr><td align=center><h4>PLEASE NOTE</h4>
All other operations should be done in another terminal. Do not disconnect to try to curl within the same terminal that is supporting the server connection.</td></tr></table>


### Confirm Connection to Redis and Mongo
Use the following endpoints to ensure connection to Redis and Mongo services:

```
$ curl 0.0.0.0:5000/status ; echo ""
{"redis":true,"db":true}
$ 
$ curl 0.0.0.0:5000/stats ; echo ""
{"users":4,"files":30}
$ 

```

### Creating a new User

### User Authentication (Sign-in/Sign-out)

### Creating A File

### Listing All Files or Individual Files for a User

### Publishing Files for Public View

### Accessing File Data

### Accessing File Thumbnail Images




---

## Program Functionality

### Repository Structure
```
[Package/Env Configs]
server.js
worker.js
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
### File/Component Explanation and Expansion

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

### Repository Structure
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

&nbsp;

#### utils/

`redis.js`
- Creates a client for a Redis Connection. Serves as storage for User Authentication services by `express.js`. The `RedisClient` class features methods to determine the connection status to Redis, as well as Redis value CRUD operations. 

`db.js`
- Creates a client to *MongoDB* and secures a connection. Serves as data storage and interaction for File Management operations by `express.js`. The `DBClient` class features methods to determine the connection status to MongoDB, as well as the database's collection tracking operations.

&nbsp;

#### controllers/

`AppController.js`
- Gives functionality to the endpoints:
```
GET /status
GET /stats
```
- Checks to see if the connection to Redis and DB is alive, as well as returning the number of users and files in their respective collections in the DB.


`UsersController.js`
- Gives functionality to the endpoints:
```
POST /users
GET /users/me
```
- Creates a new user in the DB with a specified email and password (SHA1 hashed), and displays a welcome message upon connection.


`AuthController.js`
- Gives functionality to the endpoints:
```
GET /connect
GET /disconnect
```
- Allows user to sign-in and sign-out using the `Authorization` header. Uses the `RedisClient` class to generate and store a authentication key for 24 hours.


`FilesController.js`
- Gives functionality to the endpoints:
```
POST /files
GET /files
GET /files/:id
GET /files/:id/data
PUT /files/:id/publish
PUT /files/:id/unpublish
```
- Creates a new file in the DB and in disk with specified attributes, retrieves files based on document and user access, and allows for updating file data and/or updating the public access of a specified file. Also features a thumbnail generator method that is serviced by `worker.js`.

&nbsp;

#### tests/
The following components are tested inside of this directory:
```
RedisClient
DBClient
The Following Endpoints:
    GET /status
    GET /stats
    POST /users
    GET /connect
    GET /disconnect
    GET /users/me
    POST /files
    GET /files/:id
    GET /files
    PUT /files/:id/publish
    PUT /files/:id/unpublish
    GET /files/:id/data
```
---
