# XBMobile

## Documentation

Documentation can be found [here](./docs/)

## Frameworks & Libraries

This app is built with:

-   `npm` for package management
-   `Ionic React` for interface, toolchain and structure
-   `react-redux` for state management

## RUN

For development: `ionic serve`

- Note: you may have to run this command as a super user the first time you run it to give ionic the permissions to create the relevant local directory structure for the app.

Code beautifier: `npx prettier --write .`

## BUILD

`ionic cap copy` To copy web assests to native platforms

`ionic cap sync` To rebuild code and sync with the android/ios projects

### Android

`ionic cap open android` To open the android studio project

`ionic cap run android -l --external` To run the project on a server in android studio

### iOS

`ionic cap open ios` To open the xCode project

`ionic cap run ios -l --external` To run the project on a server in xcode

Update version numbers in app manifest before packaging.


## Google Play Store

App MUST be published as uk.ac.soton.ecs.xbapp

The java namespace and gradle build must be configured accordingly.

The app MUST be signed using the upload key from XBKeyStore.jks - please contact Richard if you do not have it



