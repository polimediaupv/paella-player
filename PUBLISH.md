# Publishing Library Versions

Paella Player use changesets (https://github.com/changesets/changesets) for version management, following these guidelines:

- When bugs are fixed or improvements are made that do not add new APIs to `@asicupv/paella-core`, a patch version is published.
- If new APIs are added to @asicupv/paella-core, a minor version is published.
- If a plugin library depends on a new API from @asicupv/paella-core, the following process must be followed:
    1. First, publish @asicupv/paella-core with its new minor version on npm.
    2. Manually update the version of the dependency to paella-core within the `peerDependencies` section of the `package.json` file of the affected plugin library.
    3. Publish a minor version of the plugin library.
- In all other cases, plugins receive a patch version when bugs are fixed or minor improvements are made, and a minor version is published if new plugins are added.

The following scripts have been added to `package.json` to manage publication with changesets:

- `changeset:add`: Add a new version. Use this script after making changes to the library and update the package.json version.
- `changeset:status`: Check the status of changesets.
- `changeset:version`: Generate a new version.
- `changeset:publish`: Publish the libraries that have been modified.

For more details, refer to the [Changesets repository](https://github.com/changesets/changesets) and the [npm documentation](https://docs.npmjs.com/).
