# CodeOrbit Modular Notes CRUD API — Task 3

This project uses routes, controllers, and a data layer as required by the task. It supports all CRUD operations and stores notes in `data/notes.json`.

## Structure
- `server.js`: starts Express and connects the routes.
- `routes/notesRoutes.js`: maps HTTP endpoints to controller functions.
- `controllers/notesController.js`: validates requests and sends responses.
- `data/notesData.js`: reads and writes note records.
- `data/notes.json`: simple local data storage.

## Run
```bash
npm install
npm start
```
Server: `http://localhost:3003`

## Endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/notes` | List notes |
| POST | `/api/notes` | Create note |
| GET | `/api/notes/:id` | Read one note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Create
`POST http://localhost:3003/api/notes`
```json
{"title":"Study Express","content":"Practice CRUD"}
```

### Update
`PUT http://localhost:3003/api/notes/1`
```json
{"content":"Practice CRUD operations"}
```

## Status codes
- `201 Created`: note created
- `200 OK`: successful read, update, or delete
- `400 Bad Request`: invalid ID or invalid input
- `404 Not Found`: note does not exist
- `500 Internal Server Error`: unexpected error

## Test with PowerShell
```powershell
$body = @{title="Test note";content="Testing CRUD"} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3003/api/notes" -ContentType "application/json" -Body $body
Invoke-RestMethod "http://localhost:3003/api/notes"
```

## How the structure works
A route receives the request, calls a controller, and the controller uses the data layer to read or update the JSON file. This separation makes the project easier to maintain.

## Limitation
JSON-file storage is suitable for a small learning project, not a production database.
