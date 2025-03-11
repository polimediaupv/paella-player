# Styling

One of the most important changes from version 1.x to version 2.x of `paella-core` has been in the structure of the DOM tree elements that build the user interface. Major changes have been made in this regard to improve the usability of the menus and to facilitate the implementation of accessibility. For example, multi-level menus have been introduced with improved keyboard navigation, and also it is now no longer necessary to specify the `tabIndex` attribute in plugins to order plugins for keyboard navigation.

All this has the counterpart that any customization that would have been done in `paella-core` 1.x styles will not be compatible with version 2.x, since the structure of the user interface elements has changed radically.

To avoid this problem in future versions, `paella-core` 2.x also brings improvements in CSS styles to make it much easier to make customizations, and also to be compatible with future changes in the DOM tree structure.

To style the player from version 2.x onwards, it will be enough to modify a series of predefined CSS variables. These variables configure colors, margins, paddings, corner radii, shading, animations and a series of other parameters, which we are going to see in this tutorial. If in the future it is necessary to make changes in the DOM tree, the idea is to make these variables continue to work in the same way in the new versions. In this way the styles will remain compatible.