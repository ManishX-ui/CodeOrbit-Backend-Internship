# Run this script in PowerShell while the API is running at http://localhost:3001
$ErrorActionPreference = "Stop"
$base = "http://localhost:3001"
$created = Invoke-RestMethod -Method Post -Uri "$base/api/notes" -ContentType "application/json" -Body (@{title="Test note";content="Testing API"} | ConvertTo-Json)
if (-not $created.success -or -not $created.data.id) { throw "Create note failed" }
$id = $created.data.id
$one = Invoke-RestMethod "$base/api/notes/$id"
if ($one.data.title -ne "Test note") { throw "Read note failed" }
$updated = Invoke-RestMethod -Method Put -Uri "$base/api/notes/$id" -ContentType "application/json" -Body (@{title="Updated test"} | ConvertTo-Json)
if ($updated.data.title -ne "Updated test") { throw "Update note failed" }
$deleted = Invoke-RestMethod -Method Delete -Uri "$base/api/notes/$id"
if (-not $deleted.success) { throw "Delete note failed" }
Write-Host "PASS: create, read, update, and delete"
