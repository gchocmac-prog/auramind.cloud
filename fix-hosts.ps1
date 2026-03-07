# Run as Administrator to fix auramind.gchocmac.workers.dev DNS
# Right-click PowerShell -> Run as Administrator, then: .\fix-hosts.ps1

$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$entry = "`n# Auramind Cloudflare Workers - fix 127.0.0.1 override`n104.21.57.12 auramind.gchocmac.workers.dev"

Add-Content -Path $hostsPath -Value $entry
Write-Host "Added hosts entry. Flushing DNS..." -ForegroundColor Green
ipconfig /flushdns
Write-Host "Done. Try opening https://auramind.gchocmac.workers.dev" -ForegroundColor Green
