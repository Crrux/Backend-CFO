# Script PowerShell pour configurer Docker Secrets sur Windows

# Vérifier si Docker est en mode Swarm
$swarmStatus = docker info | Select-String "Swarm:"
if ($swarmStatus -notmatch "active") {
    Write-Host "Initialisation du mode Swarm..."
    docker swarm init
}

# Vérifier si le fichier .env.production existe
if (Test-Path -Path ".env.production") {
    Write-Host "Création des secrets à partir de .env.production..."
    
    # Lire le contenu du fichier
    $envContent = Get-Content -Path ".env.production"
    
    # Extraire les valeurs
    $mailerPassword = ($envContent | Select-String "MAILER_PASSWORD=").Line.Split('=', 2)[1].Trim()
    $encryptionKey = ($envContent | Select-String "ENCRYPTION_KEY=").Line.Split('=', 2)[1].Trim()
    $mailerUsername = ($envContent | Select-String "MAILER_USERNAME=").Line.Split('=', 2)[1].Trim()
    $mailerSubject = ($envContent | Select-String "MAILER_SUBJECT=").Line.Split('=', 2)[1].Trim()
    
    # Créer les secrets Docker
    $mailerPassword | docker secret create mailer_password -
    $encryptionKey | docker secret create encryption_key -
    $mailerUsername | docker secret create mailer_username -
    $mailerSubject | docker secret create mailer_subject -
    
    Write-Host "Secrets créés avec succès!"
} else {
    Write-Host "Fichier .env.production non trouvé!"
    exit 1
}
