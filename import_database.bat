@echo off
setlocal enabledelayedexpansion

REM Configuration
set DB_NAME=Nourane
set DB_HOST=localhost
set DB_PORT=27017
set IMPORT_DIR=database_export

REM Vérifier que le répertoire d'import existe
if not exist "%IMPORT_DIR%" (
    echo ❌ Le répertoire %IMPORT_DIR% n'existe pas
    echo 💡 Veuillez d'abord exporter la base de données avec export_database.bat
    pause
    exit /b 1
)

echo 🚀 Début de l'import de la base de données %DB_NAME%...

REM Liste des collections à importer
set COLLECTIONS=activities addresses basket cards discounts favorites orders products scheduledexports users

REM Importer chaque collection
for %%c in (%COLLECTIONS%) do (
    set json_file=%IMPORT_DIR%\%%c.json
    
    if exist "!json_file!" (
        echo 📦 Import de la collection: %%c
        
        REM Vider la collection existante (optionnel)
        echo 🗑️  Suppression de la collection existante %%c...
        mongo %DB_NAME% --eval "db.%%c.drop()" --quiet
        
        REM Importer les données
        mongoimport --host=%DB_HOST% --port=%DB_PORT% --db=%DB_NAME% --collection=%%c --file="!json_file!" --jsonArray
        
        if !errorlevel! equ 0 (
            echo ✅ Collection %%c importée avec succès
        ) else (
            echo ❌ Erreur lors de l'import de la collection %%c
        )
    ) else (
        echo ⚠️  Fichier !json_file! non trouvé, collection %%c ignorée
    )
)

echo 🎉 Import terminé !
echo 📊 Collections importées: %COLLECTIONS%
echo 💡 Vous pouvez maintenant vérifier vos données dans MongoDB Compass

pause 