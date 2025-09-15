#!/bin/bash

# Configuration
DB_NAME="Nourane"
DB_HOST="localhost"
DB_PORT="27017"
IMPORT_DIR="database_export"

# Vérifier que le répertoire d'import existe
if [ ! -d "$IMPORT_DIR" ]; then
    echo "❌ Le répertoire $IMPORT_DIR n'existe pas"
    echo "💡 Veuillez d'abord exporter la base de données avec ./export_database.sh"
    exit 1
fi

echo "🚀 Début de l'import de la base de données $DB_NAME..."

# Liste des collections à importer
COLLECTIONS=("activities" "addresses" "basket" "cards" "discounts" "favorites" "orders" "products" "scheduledexports" "users")

# Importer chaque collection
for collection in "${COLLECTIONS[@]}"; do
    json_file="$IMPORT_DIR/${collection}.json"
    
    if [ -f "$json_file" ]; then
        echo "📦 Import de la collection: $collection"
        
        # Vider la collection existante (optionnel - commentez si vous voulez préserver les données existantes)
        echo "🗑️  Suppression de la collection existante $collection..."
        mongo $DB_NAME --eval "db.$collection.drop()" --quiet
        
        # Importer les données
        mongoimport \
            --host=$DB_HOST \
            --port=$DB_PORT \
            --db=$DB_NAME \
            --collection=$collection \
            --file="$json_file" \
            --jsonArray
        
        if [ $? -eq 0 ]; then
            echo "✅ Collection $collection importée avec succès"
        else
            echo "❌ Erreur lors de l'import de la collection $collection"
        fi
    else
        echo "⚠️  Fichier $json_file non trouvé, collection $collection ignorée"
    fi
done

echo "🎉 Import terminé !"
echo "📊 Collections importées: ${COLLECTIONS[*]}"
echo "💡 Vous pouvez maintenant vérifier vos données dans MongoDB Compass" 