# Paella Player Roadmap

## Version 9

### Remove static layouts

- Locate the static layout plugins in paella-core
    * es.upv.paella.singleVideo
    * es.upv.paella.doubleVideo
    * es.upv.paella.tripleVideo
    * es.upv.paella.dualVideoPiP
- Remove static layouts from the sample code and test the player with the default layout
- Create dynamic version of the static layouts that currently does not exists:
    * es.upv.paella.tripleVideo
    * es.upv.paella.dualVideoPiP
- Remove the static layout code from VideoContainer.ts
- Handle errors when a static layout is requested. Refer to the documentation and give clear instructions on how to replace the old static layout with the new dynamic version.
    * Add a new API method in the layout plugin to inform the developer what static layout is being replaced by this dynamic layout.
    * This method should be used in the error message to inform the developer about the replacement options.
- Clean up code and documentation related to static layouts.

### Clean up and refactoring

During the migration to TypeScript, several shortcuts were taken to speed up the process. Paella-core needs to be reviewed to properly type private code, even if it is not exposed to developers.

The code for VideoContainer, StreamProvider, and VideoLayout has remained virtually unchanged since version 7. The elimination of static layouts will be used to refactor and clean up the code for these classes.
