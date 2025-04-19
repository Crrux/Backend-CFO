#!/bin/sh
set -e

# Fonction pour lire les secrets Docker
read_secret() {
  if [ -f "/run/secrets/$1" ]; then
    cat "/run/secrets/$1"
  else
    echo "Secret $1 not found"
    exit 1
  fi
}

# Exporter les secrets comme variables d'environnement
if [ -f "/run/secrets/mailer_password" ]; then
  export MAILER_PASSWORD=$(read_secret mailer_password)
fi

if [ -f "/run/secrets/encryption_key" ]; then
  export ENCRYPTION_KEY=$(read_secret encryption_key)
fi

if [ -f "/run/secrets/mailer_username" ]; then
  export MAILER_USERNAME=$(read_secret mailer_username)
fi

if [ -f "/run/secrets/mailer_subject" ]; then
  export MAILER_SUBJECT=$(read_secret mailer_subject)
fi

# Vérifier et créer le fichier de la base de données s'il n'existe pas
DB_DIR=$(dirname $DB_DATABASE)
if [ ! -d "$DB_DIR" ]; then
  mkdir -p $DB_DIR
  chmod 777 $DB_DIR
fi

if [ ! -f "$DB_DATABASE" ]; then
  touch "$DB_DATABASE"
  chmod 666 "$DB_DATABASE"
  echo "Base de données créée: $DB_DATABASE"
fi

# Exécuter la commande
exec "$@"
