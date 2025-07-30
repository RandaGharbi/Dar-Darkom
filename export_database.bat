@echo off
setlocal enabledelayedexpansion

REM Configuration
set DB_NAME=Guerlain
set DB_HOST=localhost
set DB_PORT=27017
set EXPORT_DIR=database_export

REM Créer le répertoire d'export s'il n'existe pas
if not exist "%EXPORT_DIR%" mkdir "%EXPORT_DIR%"

REM Liste des collections à exporter
set COLLECTIONS=activities addresses basket cards discounts favorites orders products scheduledexports users

echo 🚀 Début de l'export de la base de données %DB_NAME%...

REM Exporter chaque collection
for %%c in (%COLLECTIONS%) do (
    echo 📦 Export de la collection: %%c
    
    REM Exporter en JSON avec mongoexport
    mongoexport --host=%DB_HOST% --port=%DB_PORT% --db=%DB_NAME% --collection=%%c --out="%EXPORT_DIR%\%%c.json" --jsonArray
    
    if !errorlevel! equ 0 (
        echo ✅ Collection %%c exportée avec succès
    ) else (
        echo ❌ Erreur lors de l'export de la collection %%c
    )
)

REM Créer un fichier de métadonnées
echo 📋 Création du fichier de métadonnées...
echo {> "%EXPORT_DIR%\metadata.json"
echo   "database_name": "%DB_NAME%",>> "%EXPORT_DIR%\metadata.json"
echo   "export_date": "%date% %time%",>> "%EXPORT_DIR%\metadata.json"
echo   "collections": [>> "%EXPORT_DIR%\metadata.json"
for %%c in (%COLLECTIONS%) do (
    echo     "%%c">> "%EXPORT_DIR%\metadata.json"
)
echo   ],>> "%EXPORT_DIR%\metadata.json"
echo   "total_collections": 10>> "%EXPORT_DIR%\metadata.json"
echo }>> "%EXPORT_DIR%\metadata.json"

echo 🎉 Export terminé !
echo 📁 Les fichiers sont disponibles dans le dossier: %EXPORT_DIR%
echo 📊 Collections exportées: %COLLECTIONS%

pause 