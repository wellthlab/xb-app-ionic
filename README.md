# XBMobile

## Frameworks & Libraries

This app is built with:
* `npm` for package management
* `Ionic React` for user interface, toolchain and structure
* `react-redux` for state management


## Run
For development: `ionic serve`

Code beautifier: `npx prettier --write .`

## Build

`ionic cap copy` To copy web assests to native platforms
`ionic cap sync` To rebuild code and sync with the android/ios projects

### Android

`ionic cap open android` To open the android studio project
`ionic cap run android -l --external` To run the project on a server in android studio

### iOS

`ionic cap open android` To open the xCode project
`ionic cap run ios -l --external` To run the project on a server in xcode


Update version numbers in app manifest before packaging.
