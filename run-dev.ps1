# Run both frontend and backend concurrently

# Start backend
$backend = Start-Process -FilePath "C:\Program Files\nodejs\npm.cmd" -ArgumentList "run", "start" -WorkingDirectory "C:\Users\PRANAV K VINOD\Downloads\Adalat-Companion-1\backend" -RedirectStandardOutput "C:\Users\PRANAV~1\AppData\Local\Temp\opencode\backend.log" -RedirectStandardError "C:\Users\PRANAV~1\AppData\Local\Temp\opencode\backend-err.log" -PassThru

# Start frontend
$frontend = Start-Process -FilePath "C:\Program Files\nodejs\npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory "C:\Users\PRANAV K VINOD\Downloads\Adalat-Companion-1\frontend" -RedirectStandardOutput "C:\Users\PRANAV~1\AppData\Local\Temp\opencode\frontend.log" -RedirectStandardError "C:\Users\PRANAV~1\AppData\Local\Temp\opencode\frontend-err.log" -PassThru

Write-Host "Backend process ID: $($backend.Id)"
Write-Host "Frontend process ID: $($frontend.Id)"
Write-Host "Backend running on http://localhost:3001"
Write-Host "Frontend running on http://localhost:5173"

# Keep script alive until user stops
while ($true) { Start-Sleep -Seconds 1 }
