# Inconel

Prototype for Windows-compatible Hyperloop code generation from Alloy. This is crazy experimental and will undoubtedly not work out of the box.

## Environment

* TiSDK 3.2.1.GA
* Alloy 1.4.0-alpha (inconel)
* Hyperloop (master)
* To run the app, you'll need all [Hyperloop for Windows requirements](https://github.com/appcelerator/hyperloop/wiki/Running-Hyperloop-on-Windows)

## Creating the Hyperloop app

```
# compile with alloy (inconel branch)
alloy compile --platform windows --hyperloop

# convert code to hyperloop format
./tools/hyperloop-me.js

# run the app
cd hyperloop && hyperloop launch
```