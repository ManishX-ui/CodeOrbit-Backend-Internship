# CodeOrbit Backend Internship Projects

This package contains three separate beginner-friendly Node.js + Express projects for the three task types.

## Before you start
1. Install Node.js LTS from https://nodejs.org/
2. Extract this ZIP.
3. Open each project folder separately in VS Code.
4. In the VS Code terminal, run `npm install`, then `npm start`.
5. Read that project's README.md before testing.

## Project ports
- Task 1 Notes REST API: http://localhost:3001
- Task 2 User Auth API: http://localhost:3002
- Task 3 Modular CRUD API: http://localhost:3003

Each project is separate and needs its own `npm install`. Run one project per terminal. If a port is already in use, stop the other server or set the PORT environment variable.

## What is included
- `CodeOrbit_Notes_REST_API`: basic REST endpoints in one main file.
- `CodeOrbit_User_Auth_API`: signup/login with bcrypt password hashing.
- `CodeOrbit_CRUD_API`: routes/controllers/data-layer structure.

## Important
The code is prepared as a learning project, but you should run it locally before submission. The ZIP does not include `node_modules`; npm installs dependencies from each `package.json`. JSON-file storage is for learning only and not production-grade. Do not upload real passwords or sensitive data.
