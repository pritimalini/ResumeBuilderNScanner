Write-Host "Starting Resume ATS Optimizer Application..." -ForegroundColor Green

# Start the backend server in a new window
Start-Process powershell -ArgumentList "-Command cd '$PSScriptRoot\backend'; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

# Wait a moment for the backend to initialize
Start-Sleep -Seconds 2

# Start the frontend server in a new window
Start-Process powershell -ArgumentList "-Command cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "Servers started successfully!" -ForegroundColor Green
Write-Host "Backend running at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend running at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the servers." -ForegroundColor Yellow
