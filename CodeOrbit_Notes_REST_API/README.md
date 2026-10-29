# CodeOrbit Notes REST API — Task 1

A beginner-friendly Node.js + Express REST API for creating, viewing, updating, and deleting notes. Notes are stored in `data/notes.json`, so they persist after a restart.

## Run
Install Node.js, then run:
```bash
npm install
npm start
```
Visit `http://localhost:3001/`.

## Endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | `/` | Welcome message |
| GET | `/api/notes` | List all notes |
| POST | `/api/notes` | Create a note |
| GET | `/api/notes/:id` | Read one note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

### Create note
`POST http://localhost:3001/api/notes`, JSON body:
```json
{"title":"My first note","content":"Learning Express"}
```
Returns `201 Created` on success.

### Update note
`PUT http://localhost:3001/api/notes/1`, JSON body:
```json
{"title":"Updated title"}
```

### Test with PowerShell
Start the server in one terminal (`npm start`), then use another:
```powershell
Invoke-RestMethod http://localhost:3001/api/notes
$body = @{ title = "Practice note"; content = "Created with PowerShell" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/notes -ContentType "application/json" -Body $body
```

### Status codes
- `201`: created
- `200`: successful read/update/delete
- `400`: invalid input or malformed JSON
- `404`: note not found
- `500`: unexpected server error

## How it works
`server.js` defines the routes and reads/writes `data/notes.json`. `express.json()` parses JSON request bodies.

## Limitation
JSON-file storage is suitable for this learning project, not a production database.
