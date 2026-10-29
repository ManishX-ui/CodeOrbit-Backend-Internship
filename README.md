# CodeOrbit Backend Development Internship Projects

This repository contains three backend development projects created as part of the CodeOrbit Backend Development Internship.

The projects demonstrate REST API development using Node.js and Express, user authentication, CRUD operations, input validation, and JSON-based data storage.

## Projects

### 1. Notes REST API

A REST API for managing notes.

**Features**

* Create notes
* Retrieve all notes
* Retrieve an individual note by ID
* Update existing notes
* Delete notes
* Validate input and handle errors
* Store notes in a JSON file

**Technology:** Node.js, Express.js, JSON

**Port:** 3001

**Project folder:** `CodeOrbit_Notes_REST_API`

### 2. User Authentication API

An API that supports basic user registration and login.

**Features**

* Register new users
* Validate user information
* Prevent duplicate registrations
* Verify login credentials
* Hash passwords before storing them
* Return appropriate success and error responses

**Technology:** Node.js, Express.js, bcryptjs, JSON

**Port:** 3002

**Project folder:** `CodeOrbit_User_Auth_API`

**Note:** This is an educational authentication project. JSON-based storage is intended for learning, not production use.

### 3. CRUD API

An API demonstrating Create, Read, Update, and Delete operations with a separated project structure.

**Features**

* Create records
* Retrieve records
* Update records
* Delete records
* Validate input
* Organize code into routes, controllers, and a data layer

**Technology:** Node.js, Express.js, JSON

**Port:** 3003

**Project folder:** `CodeOrbit_CRUD_API`

## Prerequisites

* Node.js
* npm
* Postman or another HTTP client

## How to Run

Open a terminal in the individual project folder.

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Repeat these steps for the project you want to run.

Each project uses a different port, so the APIs can be run separately or in parallel.

## Testing

The APIs can be tested using Postman by sending HTTP requests to their local endpoints.

Examples:

* Notes API: `http://localhost:3001/api/notes`
* Authentication API: `http://localhost:3002`
* CRUD API: `http://localhost:3003/api/notes`

Refer to each project's README for its specific endpoints and request examples.

## Learning Outcomes

* Understanding REST API principles
* Implementing HTTP methods and status codes
* Building APIs with Node.js and Express
* Validating incoming requests
* Handling errors
* Implementing basic password hashing
* Organizing backend code into separate modules
* Testing APIs using Postman

## Internship

**Program:** CodeOrbit Backend Development Internship
**Project category:** Backend Development
**Repository purpose:** Educational projects and demonstration of backend development skills

---

*Developed for learning and practicing backend development.*
