# CodeOrbit Backend Internship — Comprehensive QA & Test Report

**Author / Intern:** Manish  
**Repository:** [CodeOrbit-Backend-Internship](https://github.com/ManishX-ui/CodeOrbit-Backend-Internship.git)  
**Date & Time of Execution:** 2026-10-30  
**Test Environment:** Windows 11 (Node.js v24.15.0, npm 12.0.2, Express 4.21.2)  

---

## 1. Executive Summary

This QA test report provides evidence and verification for the three Node.js & Express backend projects completed as part of the **CodeOrbit Tech Backend Development Internship Program**:
1. **Task 1: CodeOrbit Notes REST API** (Port `3001`)
2. **Task 2: CodeOrbit User Authentication API** (Port `3002`)
3. **Task 3: CodeOrbit Modular CRUD API** (Port `3003`)

All three API servers were installed, started, and verified on localhost. A total of **22 automated end-to-end HTTP tests** covering health-checks, CRUD lifecycle, authentication workflows, security validations, and error handling were executed against the live servers with a **100% pass rate**.

---

## 2. Server Ports & Localhost Verification

| Project / Task | Directory | Configured Port | Root Endpoint URL | Localhost Verification Status | Screenshot Evidence |
|---|---|---|---|---|---|
| **Task 1: Notes REST API** | `CodeOrbit_Notes_REST_API` | `3001` | `http://localhost:3001/` | **PASSED** (HTTP 200 OK) | `screenshots/task1-localhost.png` |
| **Task 2: User Auth API** | `CodeOrbit_User_Auth_API` | `3002` | `http://localhost:3002/` | **PASSED** (HTTP 200 OK) | `screenshots/task2-localhost.png` |
| **Task 3: Modular CRUD API** | `CodeOrbit_CRUD_API` | `3003` | `http://localhost:3003/` | **PASSED** (HTTP 200 OK) | `screenshots/task3-localhost.png` |

---

## 3. Detailed Test Execution Results

### Task 1: Notes REST API (`http://localhost:3001`)
*Single-file Express REST API managing persistent notes stored in `data/notes.json`.*

| # | Test Case | Method | Endpoint URL | Request Body | Expected Status | Actual Status | Result | Details / Response Summary |
|---|---|---|---|---|---|---|---|---|
| 1.1 | Root Health Check | `GET` | `http://localhost:3001/` | N/A | `200` | `200` | **PASS** | Returns `"message": "CodeOrbit Notes REST API is running"` and available endpoints array. |
| 1.2 | GET All Notes | `GET` | `http://localhost:3001/api/notes` | N/A | `200` | `200` | **PASS** | Successfully retrieved existing stored notes array. |
| 1.3 | POST Create Note | `POST` | `http://localhost:3001/api/notes` | `{"title":"Task 1 Test Note","content":"Building and testing beginner-friendly REST APIs with Node and Express"}` | `201` | `201` | **PASS** | Note created with ID `2`, `createdAt` ISO timestamp, and `success: true`. |
| 1.4 | GET Note by ID | `GET` | `http://localhost:3001/api/notes/2` | N/A | `200` | `200` | **PASS** | Returned note with ID `2` matching requested title and content. |
| 1.5 | PUT Update Note | `PUT` | `http://localhost:3001/api/notes/2` | `{"title":"Updated Task 1 Note","content":"Updated note content verified successfully"}` | `200` | `200` | **PASS** | Updated title and content; returned note contains updated values and `updatedAt`. |
| 1.6 | DELETE Note | `DELETE` | `http://localhost:3001/api/notes/2` | N/A | `200` | `200` | **PASS** | Note removed from `notes.json`; returned `success: true` and `"message": "Note deleted"`. |
| 1.7 | Validation: Empty Title | `POST` | `http://localhost:3001/api/notes` | `{"title":"","content":"Invalid note test"}` | `400` | `400` | **PASS** | Rejected with `"title must be a non-empty string and content must be a string"`. |
| 1.8 | Error: Note Not Found | `GET` | `http://localhost:3001/api/notes/999999` | N/A | `404` | `404` | **PASS** | Returned `success: false` and `"message": "Note not found"`. |

---

### Task 2: User Authentication API (`http://localhost:3002`)
*Express API managing user registration and credential verification with `bcryptjs` password hashing.*

| # | Test Case | Method | Endpoint URL | Request Body | Expected Status | Actual Status | Result | Details / Response Summary |
|---|---|---|---|---|---|---|---|---|
| 2.1 | Root Health Check | `GET` | `http://localhost:3002/` | N/A | `200` | `200` | **PASS** | Returns `"message": "CodeOrbit User Auth API is running"` and endpoint definitions. |
| 2.2 | Signup Valid User | `POST` | `http://localhost:3002/api/auth/signup` | `{"name":"QA Test Engineer","email":"<generated>@codeorbit.test","password":"Password#2026"}` | `201` | `201` | **PASS** | User created with hashed password; response returns safe public user object (id, name, email, createdAt) without exposing password hash. |
| 2.3 | Login Valid Credentials | `POST` | `http://localhost:3002/api/auth/login` | `{"email":"<generated>@codeorbit.test","password":"Password#2026"}` | `200` | `200` | **PASS** | Password verified against bcrypt hash; returned `200 OK` with `"message": "Login successful"`. |
| 2.4 | Login Incorrect Password | `POST` | `http://localhost:3002/api/auth/login` | `{"email":"<generated>@codeorbit.test","password":"IncorrectPassword999"}` | `401` | `401` | **PASS** | Rejected with `401 Unauthorized` and `"message": "Invalid email or password"`. |
| 2.5 | Duplicate Signup | `POST` | `http://localhost:3002/api/auth/signup` | `{"name":"QA Duplicate","email":"<generated>@codeorbit.test","password":"AnotherPassword123"}` | `409` | `409` | **PASS** | Conflict detected; rejected with `409 Conflict` and `"message": "An account with this email already exists"`. |
| 2.6 | Validation: Invalid Fields | `POST` | `http://localhost:3002/api/auth/signup` | `{"name":"A","email":"not-an-email","password":"short"}` | `400` | `400` | **PASS** | Input validation caught short name (< 2 chars); rejected with `400 Bad Request`. |

---

### Task 3: Modular CRUD API (`http://localhost:3003`)
*Structured Express architecture separating concerns into Routes (`routes/notesRoutes.js`), Controllers (`controllers/notesController.js`), and Data Access (`data/notesData.js`).*

| # | Test Case | Method | Endpoint URL | Request Body | Expected Status | Actual Status | Result | Details / Response Summary |
|---|---|---|---|---|---|---|---|---|
| 3.1 | Root Health Check | `GET` | `http://localhost:3003/` | N/A | `200` | `200` | **PASS** | Returns `"message": "CodeOrbit modular CRUD API is running"` and `notesEndpoint: "/api/notes"`. |
| 3.2 | GET All Records | `GET` | `http://localhost:3003/api/notes` | N/A | `200` | `200` | **PASS** | Successfully retrieved records array through controller and data layer. |
| 3.3 | POST Create Record | `POST` | `http://localhost:3003/api/notes` | `{"title":"Modular Architecture Note","content":"Separating concerns across routes, controllers, and data storage layers"}` | `201` | `201` | **PASS** | Created new record with ID `2` via data layer; returned `201 Created`. |
| 3.4 | GET Record by ID | `GET` | `http://localhost:3003/api/notes/2` | N/A | `200` | `200` | **PASS** | Controller validated positive integer ID and returned requested record. |
| 3.5 | PUT Update Record | `PUT` | `http://localhost:3003/api/notes/2` | `{"title":"Updated Modular Architecture Note","content":"Updated content verified through controller logic"}` | `200` | `200` | **PASS** | Controller validated payload and updated record; returned updated object with `updatedAt`. |
| 3.6 | DELETE Record | `DELETE` | `http://localhost:3003/api/notes/2` | N/A | `200` | `200` | **PASS** | Deleted record from storage; returned `200 OK` and `"message": "Note deleted"`. |
| 3.7 | Validation: Missing Title | `POST` | `http://localhost:3003/api/notes` | `{"content":"Missing title property"}` | `400` | `400` | **PASS** | Validation caught missing title; rejected with `"title is required and content must be a string"`. |
| 3.8 | Validation: Non-integer ID | `GET` | `http://localhost:3003/api/notes/invalid_id` | N/A | `400` | `400` | **PASS** | Controller validated ID parameter; returned `"message": "Note ID must be a positive integer"`. |

---

## 4. Evidence & Deliverables

### Localhost Browser Screenshots
Captured via genuine Chrome browser rendering against the running Node.js servers:
1. `SUBMISSION_EVIDENCE/screenshots/task1-localhost.png` — Confirms Notes REST API responding on `http://localhost:3001/`
2. `SUBMISSION_EVIDENCE/screenshots/task2-localhost.png` — Confirms User Auth API responding on `http://localhost:3002/`
3. `SUBMISSION_EVIDENCE/screenshots/task3-localhost.png` — Confirms Modular CRUD API responding on `http://localhost:3003/`

### Postman Artifacts
A complete, pre-configured collection is saved at:
`SUBMISSION_EVIDENCE/postman/CodeOrbit_Backend_Internship.postman_collection.json`
- Compatible with Postman Desktop and Postman Web (Collection Schema v2.1.0).
- Contains organized folders for all three tasks with sample bodies, URLs, headers, and test cases.

### Automated Test Runner & Raw Log
- Test script: `SUBMISSION_EVIDENCE/run_all_tests.js`
- Full execution JSON log: `SUBMISSION_EVIDENCE/test_execution_log.json`

---

## 5. Bugs Discovered and Fixes Made

- **Port & Concurrency Verification:** Verified that all three projects have their default ports (`3001`, `3002`, `3003`) isolated so all three services can run concurrently without port collisions.
- **Data Persistence:** Confirmed that `notes.json` and `users.json` handle missing files gracefully with fallback arrays (`[]`).
- **Validation Consistency:** Confirmed that invalid JSON bodies trigger clean `400 Bad Request` responses rather than crashing the Express process.
- No breaking bugs or code alterations were needed; all three implementations conform cleanly to specifications.

---

## 6. Environment Limitations & Honest Reporting

Per the prompt guidelines:
1. **Postman Desktop GUI Application:** The standalone Postman desktop GUI application was not installed on this Windows environment, and the backend agent operates in a non-interactive console environment without mouse-clicking capabilities. Rather than fabricating mockups or fake GUI windows, genuine HTTP execution was completed and verified through the live Node test runner, and a ready-to-import Postman collection (`CodeOrbit_Backend_Internship.postman_collection.json`) was generated.
2. **Screen Recording:** A desktop screen recording tool (such as OBS or ffmpeg) is not installed on the system, and headless sessions cannot capture full desktop video. In strict accordance with the instructions ("*Do not fabricate a recording or claim the video exists if the available tools cannot create it. If a required recording capability is unavailable, explain exactly what is missing and complete all other possible tasks*"), the video file was not fabricated. The intern can record the 2–3 minute video following `VIDEO_SCRIPT.md` using the provided Postman collection.

---

## 7. Conclusion

All 3 internship tasks meet or exceed the requirements specified by **CodeOrbit Tech**:
- **Task 1 (Notes REST API):** 100% operational, full CRUD + validation.
- **Task 2 (User Authentication API):** 100% operational, secure bcrypt hashing, safe public user responses, duplicate and validation prevention.
- **Task 3 (Modular CRUD API):** 100% operational, clean 3-tier architecture (routes, controllers, data).

