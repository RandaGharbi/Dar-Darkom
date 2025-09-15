#!/bin/bash

# Configuration
DB_NAME="Nourane"
DB_HOST="localhost"
DB_PORT="27017"
EXPORT_DIR="database_export"

# Créer le répertoire d'export s'il n'existe pas
mkdir -p $EXPORT_DIR

# Liste des collections à exporter (basée sur ce que j'ai vu dans l'image)
COLLECTIONS=("activities" "addresses" "basket" "cards" "discounts" "favorites" "orders" "products" "scheduledexports" "users")

echo "🚀 Début de l'export de la base de données $DB_NAME..."

# Exporter chaque collection
for collection in "${COLLECTIONS[@]}"; do
    echo "📦 Export de la collection: $collection"
    
    # Exporter en JSON avec mongoexport
    mongoexport \
        --host=$DB_HOST \
        --port=$DB_PORT \
        --db=$DB_NAME \
        --collection=$collection \
        --out="$EXPORT_DIR/${collection}.json" \
        --jsonArray
    
    if [ $? -eq 0 ]; then
        echo "✅ Collection $collection exportée avec succès"
    else
        echo "❌ Erreur lors de l'export de la collection $collection"
    fi
done

# Créer un fichier de métadonnées
echo "📋 Création du fichier de métadonnées..."
cat > "$EXPORT_DIR/metadata.json" << EOF
{
  "database_name": "$DB_NAME",
  "export_date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "collections": $(printf '%s\n' "${COLLECTIONS[@]}" | jq -R . | jq -s .),
  "total_collections": ${#COLLECTIONS[@]}
}
EOF

echo "🎉 Export terminé !"
echo "📁 Les fichiers sont disponibles dans le dossier: $EXPORT_DIR"
echo "📊 Collections exportées: ${COLLECTIONS[*]}" 