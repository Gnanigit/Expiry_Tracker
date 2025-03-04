# Get the IPv4 address of the active network
$ipAddress = (Get-NetIPAddress | Where-Object { $_.AddressFamily -eq "IPv4" -and $_.PrefixOrigin -eq "Dhcp" }).IPAddress

# Check if IP address was found
if ($ipAddress) {
    Write-Host "Setting REACT_NATIVE_PACKAGER_HOSTNAME to $ipAddress"

    # Set the environment variable permanently
    Start-Process -Verb RunAs -FilePath "powershell" -ArgumentList "-Command `"setx /M REACT_NATIVE_PACKAGER_HOSTNAME $ipAddress`"" -Wait

    # Define the .env file path
    $envFilePath = "$PSScriptRoot\.env"

    # Check if .env file exists
    if (Test-Path $envFilePath) {
        # Read the .env file line by line
        $envLines = Get-Content $envFilePath
        
        $port=":5000"
        $updatedLines = $envLines -replace "(?i)^REACT_NATIVE_APP_SERVER_DOMAIN\s*=\s*'http://.*'", "REACT_NATIVE_APP_SERVER_DOMAIN='http://$ipAddress$port'"

        # Write back to the .env file
        $updatedLines | Set-Content $envFilePath
       
        Write-Host "Updated .env file with new IP: 'http://$ipAddress$port'"
    } else {
        Write-Host "No .env file found! Skipping update."
    }

    # Start Expo
    Write-Host "Starting Expo..."
    # npx expo start -c
    npx expo start --dev-client -c
} else {
    Write-Host "No IPv4 address found!"
}
