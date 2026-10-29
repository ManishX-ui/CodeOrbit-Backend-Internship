# Run in PowerShell while the API is running at http://localhost:3002.
$ErrorActionPreference = "Stop"
$base = "http://localhost:3002"
$email = "internship-test-$([guid]::NewGuid().ToString('N'))@example.com"
$signupBody = @{name="Test User";email=$email;password="testpass123"} | ConvertTo-Json
$signup = Invoke-RestMethod -Method Post -Uri "$base/api/auth/signup" -ContentType "application/json" -Body $signupBody
if (-not $signup.success -or $signup.user.email -ne $email) { throw "Signup failed" }
$loginBody = @{email=$email;password="testpass123"} | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -ContentType "application/json" -Body $loginBody
if (-not $login.success) { throw "Login failed" }
try {
  $badBody = @{email=$email;password="wrongpass"} | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -ContentType "application/json" -Body $badBody
  throw "Wrong password should fail"
} catch {
  if ($_.Exception.Response.StatusCode.value__ -ne 401) { throw }
}
Write-Host "PASS: signup, login, and wrong-password rejection"
