# Work In Progress - Not Ready for General Use
## This is a work in progress and is not ready to use. Please re-visit in 1-2 weeks for the completed code pattern


In this developer journey, we will create a mobile app using Apache Cordova, Node.js and Watson Visual Recognition. This mobile app sends pictures of auto and motorcycle accidents and issues to be analyzed by a server app, using Watson Visual Recognition.

Currently this mobile app only runs on Android, but can be easily ported to iOS.


## Flow

1. User interacts with the mobile app and captures an image.
2. The image is passed to the server application which uses Watson Visual Recognition Service to analyze the images.
3. Data is returned to the mobile app for display.

## With Watson

Want to take your Watson app to the next level? Looking to leverage Watson Brand assets? Join the [With Watson](https://www.ibm.com/watson/with-watson/) program which provides exclusive brand, marketing, and tech resources to amplify and accelerate your Watson embedded commercial solution.

## Included components

* [Watson Visual Recognition](https://www.ibm.com/watson/developercloud/visual-recognition.html): Visual Recognition understands the contents of images - visual concepts tag the image, find human faces, approximate age and gender, and find similar images in a collection.

## Featured Technologies

* Mobile: Systems of engagement are increasingly using mobile technology as the platform for delivery.
* [Node.js](https://nodejs.org/): An asynchronous event driven JavaScript runtime, designed to build scalable applications.

# Watch the Video

# Steps

This journey contains several pieces. The app server communicates with the Watson Visual Recognition service. The mobile application is built locally and run on the Android phone.

## Deploy the Server Application to Bluemix

1. Press the above ``Deploy to Bluemix`` button and then click on ``Deploy``.

2. In Toolchains, click on Delivery Pipeline to watch while the app is deployed.

![Toolchain pipeline](doc/source/images/toolchain-pipeline.png)

3. To see the app and services created and configured for this journey, use the Bluemix dashboard. The app is named `watson-vehicle-damage-analyzer` with a unique suffix. The following services are created and easily identified by the `wcc-` prefix:
    * wcc-visual-recognition

> Note: Make note of the `watson-vehicle-damage-analyzer` URL route - it will be required for later use in the mobile app.

To complete the installation, perform the following steps:

1. [Clone the repo](#1-clone-the-repo)
2. [Update config values for the Mobile App](#3-update-config-values-for-the-mobile-app)
3. [Install dependencies to build the mobile application](#4-install-dependencies-to-build-the-mobile-application)
4. [Add Android platform and plug-ins](#5-add-android-platform-and-plug-ins)
5. [Setup your Android device](#6-setup-your-android-device)
6. [Build and run the mobile app](#7-build-and-run-the-mobile-app)

## 1. Clone the repo

Clone the `watson-vehicle-damage-analyzer` repo locally. In a terminal, run:

```
$ git clone https://github.com/IBM/watson-vehicle-damage-analyzer.git 
$ cd watson-vehicle-damage-analyzer
```

## 2. Update config values for the Mobile App

Edit `mobile/www/config.json` and update the setting with the values retrieved previously.

```javascript
"BLUEMIX_SERVER_URL": "<add-bluemix-server-url>"
```

## 3. Install dependencies to build the mobile application

Building the mobile application requires a few dependencies that you can either manually install yourself, **or** you can use [Docker](https://docs.docker.com/engine/installation/).

### Using Docker

```
$ cd watson-vehicle-damage-analyzer/mobile
$ docker build -t calorie-counter .
[truncated output]
Successfully built <image-id>
```

You can then use `cordova` by running the image, mounting the repository's `mobile/` directory to `/mobile` in the container:

```
$ docker run --volume "watson-vehicle-damage-analyzer/mobile:/mobile" calorie-counter cordova --help
```

### Using manually-installed dependencies

For this journey, you'll need to install the prerequisites, by following their respective documentation:

* [Java Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [Node.js and npm](https://nodejs.org/en/download/) (`npm` version 4.5.0 or higher)
* [Android Studio](https://developer.android.com/studio/), which includes Android tools and gives you access to Android SDKs
* [Cordova](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)
* [Gradle](https://gradle.org/install/)

You'll need to install the specific SDK appropriate for your mobile device. From `Android Studio`, download and install the desired API Level for the SDK. To do this:

* Launch `Android Studio` and accept all defaults.
* Click on the `SDK Manager` icon in the toolbar.
* Navigate to `Appearance & Behavior` -> `System Settings` -> `Android SDK`
* Select Android 6.0 (Marshmallow) (API Level 23).
* Click apply to download and install.

Once you have completed all of the required installs and setup, you should have the following environment variables set appropriately for your platform:

* `JAVA_HOME`
* `ANDROID_HOME`
* `PATH`

> Note: For additonal help setting these environment variables, refer to the  [Troubleshooting](#troubleshooting) section below.

## 4. Add Android platform and plug-ins

If you're using Docker, then you'll need to run *all* of the `cordova` commands inside your Docker container. Adjust the path for `watson-vehicle-damage-analyzer/mobile` based on your present working directory.For example:

```
$ docker run \
  --volume="watson-vehicle-damage-analyzer/mobile:/mobile" \
  calorie-counter \
  cordova --help
```

Start by adding the Android platform as the target for your mobile app.

```
$ cd watson-vehicle-damage-analyzer/mobile
$ cordova platform add android
```

Ensure that everything has been installed correctly:

```
$ cordova requirements
```

Finally, install the plugins required by the application:

```
$ cordova plugin add cordova-plugin-camera
$ cordova plugin add cordova-plugin-file-transfer
```

## 5. Setup your Android device

In order to run the application on your Android device, you will need to be prepared to transfer the application's `.apk` file to your device (created in the next step). There are multiple ways for developers to achieve this.

Android Studio will handle the transfer for you if you tether your Android device to your computer, and enable both `developer options` and `web debugging`.

> Note: Please refer to documentation on your specific phone to set these options.

For Mac users, [Android File Transfer](https://www.android.com/filetransfer/) will facilitate simple file transfers between your computer and Android device.

## 6. Build and run the mobile app

> Note: If you're using Docker, remember to prefix all your `cordova` commands with `docker …`.

```
$ cd watson-vehicle-damage-analyzer/mobile
$ cordova build android
```

An `.apk` file should appear at `watson-vehicle-damage-analyzer/mobile/platforms/android/build/outputs/apk/android-debug.apk`, which contains the Android application.

You can then either manually transfer the `.apk` to your device and run it yourself, or if your device is tethered (as described in the previous step), then you can run:

```
$ cordova run android
```

However, a Docker container does not have access to your host's USB devices, unless you explicitly allow them to be passed through. You can expose your device to the Docker container, and allow Cordova to do the transfer for you. To accomplish that, you'll need to know which USB device to pass through. Discover your USB devices with `lsusb`.

For example, in this case, I know that my Android device is `Bus 001, Device 002`:

```
$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 003: ID 046d:082d Logitech, Inc. HD Pro Webcam C920
Bus 001 Device 002: ID 18d1:4ee6 Google Inc.
Bus 001 Device 005: ID 046d:c085 Logitech, Inc.
Bus 001 Device 004: ID 045e:02e6 Microsoft Corp.
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

I can then pass my device through to the container using `--device=/dev/bus/usb/<bus-number>/<device-number>` and allow Cordova to access it. The complete Docker command would then be:

```
$ docker run \
  --volume="watson-vehicle-damage-analyzer/mobile:/mobile" \
  --device=/dev/bus/usb/001/002 \
  calorie-counter \
  cordova run android
```

At this point, the app named `Calorie Counter` should be on your mobile device. Use the camera icon to take a photo of a food item, and allow Watson to analyze the image and fetch the calorie results.

# Sample Output

<img src="doc/source/images/output1.jpg" width="250">  <img src="doc/source/images/output2.jpg" width="250">

# Links

* [Watson Node.js SDK](https://github.com/watson-developer-cloud/node-sdk)

# Troubleshooting

* `cordova run android` error: Failure [INSTALL_FAILED_UPDATE_INCOMPATIBLE]

> The `Vehicle Damage Analyzer` app is already installed on your phone and incompatible with the version you are now trying to run. Uninstall the current version and try again.

* `cordova run android` error: No target specified and no devices found, deploying to emulator

> Ensure that your phone is plugged into your computer and you can access it from the Android File Transfer utility (see Step #6 above).

* How to determine proper values for environment variables:

Open `Android Studio` and navigate to `File` -> `Project Structure` -> `SDK
Location`. This location value will serve as the base for your environement variables. For example, if the location is `/users/joe/Android/sdk`, then:

```
$ export ANDROID_HOME=/users/joe/Android/sdk
$ export ANDROID_SDK_HOME=/users/joe/Android/sdk/platforms/android-<api-level>
$ export PATH=${PATH}:/users/joe/Android/sdk/platform-tools:/users/joe/Android/sdk/tools
```

* Error: Server error, status code: 502, error code: 10001, message: Service broker error: {"description"=>"Only one free key is allowed per organization. Contact your organization owner to obtain the key."}

> Only one free key is allowed per organization. Binding the service to an application triggers a process that tries to allocate a new key,which will get rejected. If you already have an instance of Visual Recognition and an associated key, you can bind that instance to your application or update the API key in your server code to tell the app which key to use.

# License

[Apache 2.0](LICENSE)

# Privacy Notice

If using the Deploy to Bluemix button some metrics are tracked, the following information is sent to a [Metrics Tracker](https://github.com/IBM/metrics-collector-service) service on each deployment:

* Node.js package version
* Node.js repository URL
* Application Name (`application_name`)
* Application GUID (`application_id`)
* Application instance index number (`instance_index`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)
* Cloud Foundry API (`cf_api`)
* Labels of bound services
* Number of instances for each bound service and associated plan information

This data is collected from the `package.json` and `repository.yaml` files in the sample application and the ``VCAP_APPLICATION`` and ``VCAP_SERVICES`` environment variables in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Metrics Tracker service will be tracked.

## Disabling Deployment Tracking

To disable tracking, simply remove `require("metrics-tracker-client").track();` from the [server/app.js](server/app.js) file.
