#!/bin/sh

# Obtener el primer argumento de la línea de comandos
REPOS=repos

# Recorrer todos los archivos de la carpeta repos
for file in $REPOS/*; do
    # Si el archivo es un directorio
    if [ -d $file ]; then
        # Obtener el nombre del fichero
        file=${file#$REPOS/}
        git submodule deinit -f $REPOS/$file
        rm -rf .git/$REPOS/$file
        git rm -f $REPOS/$file
    fi
done
