# Mailspring Theme Updater Plugin - [Download v1.0.0](https://github.com/danieljimeneznz/mailspring-theme-updater-plugin/releases/download/v1.0.0/mailspring-theme-updater-plugin.zip)

This plugin aims to be a quick fix for keeping a theme up to date with its remote counterpart.

If you like this plugin, check out my Mailspring theme inspired by Inbox, and Google Cloud Console: [Mailspring Agapanthus Theme](https://github.com/danieljimeneznz/mailspring-agapanthus-theme)

## Build Instructions

Due to the power of Intellisense, and difficulty compiling the plugin utilising `Babel`, typescript was chosen to build the
plugin (+ mailspring has moved to typescript, so if the plugin was to be included in the base application, adding it to
would be super easy).

1. Clone the main Mailspring repository into a directory i.e. `root/Mailspring` (Note, this does not need to compile
   correctly as this repository is only needed for typing).
2. Clone this repository into a directory with the same parent i.e. `root/mailspring-theme-updater-plugin`.
3. Run `npm run build` in the plugin directory which will output the compiled files in
   `root/mailspring-theme-updater-plugin/dist/mailspring-theme-updater-plugin/lib` (Note, errors may occur due to compilation errors with the
   Mailspring repository, check the output lib files were compiled correctly).
4. Run `npm run post-build` in the plugin directory which will copy the `package.json` into the `root/mailspring-theme-updater-plugin/dist/mailspring-theme-updater-plugin/lib` folder
   and install the corresponding dependencies.
5. Install the plugin!

## Notes

- Types are referenced by the `tsconfig.json` file including the `../Mailspring/app/src/global/*` files, which contain the
  declarations for the types that Mailspring exports.
  
## Current Plugin Constraints
- This plugin only supports updating themes that have a github remote.
- This plugin currently only works when the git repo folder has a remote that ends in ".git" and the `package.json` does not (to be fixed in issue [#4](https://github.com/danieljimeneznz/mailspring-theme-updater-plugin/issues/4)).
- GitHub unauthenticated API only allows for 60 calls/hour, which will leave the theme directory in an un-usable state (to be fixed in issue [#2](https://github.com/danieljimeneznz/mailspring-theme-updater-plugin/issues/2) which will use a .staging directory to get all updates over time or allow user to put in an api-key like value or use git to perform the updates (somehow)).
