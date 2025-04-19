#!/bin/bash

# Créer les secrets Docker pour les informations sensibles
echo "Initialisation des secrets Docker..."

# Vérifier si Docker est en mode Swarm
if ! docker info | grep -q "Swarm: active"; then
  echo "Initialisation du mode Swarm..."
  docker swarm init
fi

# Créer les secrets à partir du fichier .env.production
if [ -f .env.production ]; then
  echo "Création des secrets à partir de .env.production..."
  
  # Extraction des valeurs depuis .env.production
  MAILER_PASSWORD=$(grep MAILER_PASSWORD .env.production | cut -d= -f2-)
  ENCRYPTION_KEY=$(grep ENCRYPTION_KEY .env.production | cut -d= -f2-)
  MAILER_USERNAME=$(grep MAILER_USERNAME .env.production | cut -d= -f2-)
  MAILER_SUBJECT=$(grep MAILER_SUBJECT .env.production | cut -d= -f2-)
  
  # Création des secrets Docker
  echo "$MAILER_PASSWORD" | docker secret create mailer_password -
  echo "$ENCRYPTION_KEY" | docker secret create encryption_key -
  echo "$MAILER_USERNAME" | docker secret create mailer_username -
  echo "$MAILER_SUBJECT" | docker secret create mailer_subject -
  
  echo "Secrets créés avec succès!"
else
  echo "Fichier .env.production non trouvé!"
  exit 1
fi
