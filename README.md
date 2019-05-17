# Mailspring Unread Plugin

This plugin aims to fix unread email UI discrepancies in the main Mailspring application as first declared in an 
[issue](https://github.com/Foundry376/Mailspring/issues/1497) I opened in the main repository.

The updates to the application were chosen to be made in a plugin for two reasons:
- Some people might actually like the current behaviour of the application.
- Due to the decoupled architecture of the application and usage of stores, the changes are extremely easily to implement
in a plugin.

## Build Instructions

Due to the power of Intellisense, and difficulty compiling the plugin utilising `Babel`, typescript was chosen to build the
plugin (+ mailspring has moved to typescript, so if the plugin was to be included in the base application, adding it to
would be super easy).

1. Clone the main Mailspring repository into a directory i.e. `root/Mailspring` (Note, this does not need to compile 
correctly as this repository is only needed for typing).
2. Clone this repository into a directory with the same parent i.e. `root/mailspring-unread-plugin`.
3. Run `npm run build` in the plugin directory which will output the compiled files in 
`root/mailspring-unread-plugin/dist/mailspring-unread-plugin/lib` (Note, errors may occur due to compilation errors with the
Mailspring repository, check the output lib files were compiled correctly).
4. Copy the `package.json` into the `root/mailspring-unread-plugin/dist/mailspring-unread-plugin` folder.
5. Install the plugin!

## Notes

Types are referenced by the `tsconfig.json` file including the `../Mailspring/app/src/global/*` files, which contain the
declarations for the types that Mailspring exports.
