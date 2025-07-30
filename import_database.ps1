# Configuration
$DB_NAME = "Guerlain"
$DB_HOST = "localhost"
$DB_PORT = "27017"
$IMPORT_DIR = "database_export"

# Vérifier que le répertoire d'import existe
if (!(Test-Path $IMPORT_DIR)) {
    Write-Host "❌ Le répertoire $IMPORT_DIR n'existe pas" -ForegroundColor Red
    Write-Host "💡 Veuillez d'abord exporter la base de données avec export_database.ps1" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour continuer..."
    exit 1
}

Write-Host "🚀 Début de l'import de la base de données $DB_NAME..." -ForegroundColor Green

# Liste des collections à importer
$COLLECTIONS = @("activities", "addresses", "basket", "cards", "discounts", "favorites", "orders", "products", "scheduledexports", "users")

# Importer chaque collection
foreach ($collection in $COLLECTIONS) {
    $jsonFile = "$IMPORT_DIR\$collection.json"
    
    if (Test-Path $jsonFile) {
        Write-Host "📦 Import de la collection: $collection" -ForegroundColor Yellow
        
        # Vider la collection existante (optionnel)
        Write-Host "🗑️  Suppression de la collection existante $collection..." -ForegroundColor Yellow
        & mongo $DB_NAME --eval "db.$collection.drop()" --quiet | Out-Null
        
        # Importer les données
        $result = & mongoimport --host=$DB_HOST --port=$DB_PORT --db=$DB_NAME --collection=$collection --file=$jsonFile --jsonArray
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Collection $collection importée avec succès" -ForegroundColor Green
        } else {
            Write-Host "❌ Erreur lors de l'import de la collection $collection" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  Fichier $jsonFile non trouvé, collection $collection ignorée" -ForegroundColor Yellow
    }
}

Write-Host "🎉 Import terminé !" -ForegroundColor Green
Write-Host "📊 Collections importées: $($COLLECTIONS -join ', ')" -ForegroundColor Cyan
Write-Host "💡 Vous pouvez maintenant vérifier vos données dans MongoDB Compass" -ForegroundColor Cyan

Read-Host "Appuyez sur Entrée pour continuer..." 