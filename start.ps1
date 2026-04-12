# Start Frontend and Backend Servers

Write-Host "Starting Full Stack App..." -ForegroundColor Green

# Start Backend (Node/Express)
Write-Host "Starting Backend on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node server.js"

# Start Frontend (Vite)
Write-Host "Starting Frontend on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Both servers are starting in separate terminals 🚀" -ForegroundColor Green