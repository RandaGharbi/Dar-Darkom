# Configuration
$DB_NAME = "Guerlain"
$DB_HOST = "localhost"
$DB_PORT = "27017"
$EXPORT_DIR = "database_export"

# Créer le répertoire d'export s'il n'existe pas
if (!(Test-Path $EXPORT_DIR)) {
    New-Item -ItemType Directory -Path $EXPORT_DIR | Out-Null
}

# Liste des collections à exporter
$COLLECTIONS = @("activities", "addresses", "basket", "cards", "discounts", "favorites", "orders", "products", "scheduledexports", "users")

Write-Host "🚀 Début de l'export de la base de données $DB_NAME..." -ForegroundColor Green

# Exporter chaque collection
foreach ($collection in $COLLECTIONS) {
    Write-Host "📦 Export de la collection: $collection" -ForegroundColor Yellow
    
    # Exporter en JSON avec mongoexport
    $outputFile = "$EXPORT_DIR\$collection.json"
    $result = & mongoexport --host=$DB_HOST --port=$DB_PORT --db=$DB_NAME --collection=$collection --out=$outputFile --jsonArray
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Collection $collection exportée avec succès" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors de l'export de la collection $collection" -ForegroundColor Red
    }
}

# Créer un fichier de métadonnées
Write-Host "📋 Création du fichier de métadonnées..." -ForegroundColor Cyan

$metadata = @{
    database_name = $DB_NAME
    export_date = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    collections = $COLLECTIONS
    total_collections = $COLLECTIONS.Count
}

$metadata | ConvertTo-Json -Depth 3 | Out-File -FilePath "$EXPORT_DIR\metadata.json" -Encoding UTF8

Write-Host "🎉 Export terminé !" -ForegroundColor Green
Write-Host "📁 Les fichiers sont disponibles dans le dossier: $EXPORT_DIR" -ForegroundColor Cyan
Write-Host "📊 Collections exportées: $($COLLECTIONS -join ', ')" -ForegroundColor Cyan

Read-Host "Appuyez sur Entrée pour continuer..." 