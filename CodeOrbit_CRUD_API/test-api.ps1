# Run in PowerShell while the API is running at http://localhost:3003.
$ErrorActionPreference = "Stop"
$base = "http://localhost:3003"
$created = Invoke-RestMethod -Method Post -Uri "$base/api/notes" -ContentType "application/json" -Body (@{title="Test note";content="CRUD test"} | ConvertTo-Json)
$id = $created.data.id
if (-not $id) { throw "Create failed" }
if ((Invoke-RestMethod "$base/api/notes/$id").data.title -ne "Test note") { throw "Read failed" }
$updated = Invoke-RestMethod -Method Put -Uri "$base/api/notes/$id" -ContentType "application/json" -Body (@{title="Updated note"} | ConvertTo-Json)
if ($updated.data.title -ne "Updated note") { throw "Update failed" }
Invoke-RestMethod -Method Delete -Uri "$base/api/notes/$id" | Out-Null
Write-Host "PASS: create, read, update, and delete"
