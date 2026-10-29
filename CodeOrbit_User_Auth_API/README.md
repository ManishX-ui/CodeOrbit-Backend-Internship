# CodeOrbit User Authentication API — Task 2

A small signup/login API built with Node.js and Express. User details are stored in `data/users.json`; passwords are hashed with `bcryptjs`, not saved as plaintext.

## Run
```bash
npm install
npm start
```
Server: `http://localhost:3002`

## Endpoints

### POST `/api/auth/signup`
Request JSON:
```json
{"name":"Asha Kumar","email":"asha@example.com","password":"strongpass123"}
```
Success: `201 Created`
```json
{"success":true,"message":"Account created successfully","user":{"id":1,"name":"Asha Kumar","email":"asha@example.com","createdAt":"2026-01-01T00:00:00.000Z"}}
```
The timestamp and ID will differ. Duplicate email returns `409`; invalid input returns `400`.

### POST `/api/auth/login`
Request JSON:
```json
{"email":"asha@example.com","password":"strongpass123"}
```
Success returns `200` with a public user object. Wrong credentials return `401`. Invalid input returns `400`.

## PowerShell example
```powershell
$signup = @{name="Asha Kumar";email="asha@example.com";password="strongpass123"} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3002/api/auth/signup" -ContentType "application/json" -Body $signup

$login = @{email="asha@example.com";password="strongpass123"} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3002/api/auth/login" -ContentType "application/json" -Body $login
```

## Security and limitations
Passwords are hashed with bcryptjs. The API does not issue a session or token; it demonstrates signup and credential verification only. JSON-file storage is for learning and is not appropriate for a production service with concurrent writes or sensitive accounts. Production authentication also needs HTTPS, rate limiting, secure sessions/tokens, and a proper database.
