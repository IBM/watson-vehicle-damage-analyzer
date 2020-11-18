# WARNING: This repository is no longer maintained :warning:

> This repository will not be updated due to legal issues. The repository will be kept available in read-only mode. 

*Read this in other languages: [中国](README-cn.md),[日本](README-ja.md).*

[![Build Status](https://api.travis-ci.org/IBM/watson-vehicle-damage-analyzer.svg?branch=master)](https://travis-ci.org/IBM/watson-vehicle-damage-analyzer)

# Create a custom Visual Recognition classifier for analyzing vehicle damage

In this developer code pattern, we will create a mobile app using Apache Cordova, Node.js and Watson Visual Recognition. This mobile app sends pictures of auto and motorcycle accidents and issues to be analyzed by a server app, using Watson Visual Recognition.

The server application will use pictures of auto accidents and other incidents to train Watson Visual Recognition to identify various classes of issues, i.e. vandalism, broken windshield, motorcycle accident, or flat tire. A developer can leverage this to create their own custom Visual Recognition classifiers for their use cases.

When the reader has completed this Code Pattern, they will understand how to:

* Create a Node.js server that can utilize the Watson Visual Recognition service for classifying images.
* Have a server initialize a Visual Recognition custom classifier at startup.
* Create a Visual Recognition custom classifier in an application.
* Create an Android mobile application that can send pictures to a server app for classification using Visual Recognition.

![](doc/source/images/architecture.png)

## Flow

1. User interacts with the mobile app and captures an image.
2. The image on the mobile phone is passed to the server application running in the cloud.
3. The server sends the image to Watson Visual Recognition Service for analysis.
4. Visual Recognition service classifies the image and returns the information to the server.

## Included components

* [Watson Visual Recognition](https://www.ibm.com/watson/services/visual-recognition/): Visual Recognition understands the contents of images - tag images, find human faces, approximate age and gender, and find similar images in a collection.

## Featured Technologies

* Mobile: Systems of engagement are increasingly using mobile technology as the platform for delivery.
* [Node.js](https://nodejs.org/): An asynchronous event driven JavaScript runtime, designed to build scalable applications.

# Watch the Video

[![](https://i.ytimg.com/vi/rVL1HsbsdBI/0.jpg)](https://youtu.be/rVL1HsbsdBI)

# Steps

> NOTE: The Watson Visual Recognition service required for this patten only exists in the US-South/Dallas region (as of 01/07/19). You will only be able to deploy and/or use this code there.

This code pattern contains several pieces. The app server communicates with the Watson Visual Recognition service. The mobile application is built locally and run on the iPhone or Android phone. You can deploy the server application using the IBM Cloud, or locally on your machine.

## Deploy the server application to IBM Cloud

[![Deploy to IBM Cloud](https://cloud.ibm.com/devops/setup/deploy/button.png)](https://cloud.ibm.com/devops/setup/deploy?repository=https://github.com/IBM/watson-vehicle-damage-analyzer)

Press the above ``Deploy to IBM Cloud`` button and then click on ``Deploy`` and then jump to step #5.

To monitor the deployment, in Toolchains click on `Delivery Pipeline`  and view the logs while the apps is being deployed.

![Toolchain pipeline](doc/source/images/toolchain-pipeline.png)

To see the app and services created and configured for this code pattern, use the IBM Cloud dashboard. The app is named `watson-vehicle-damage-analyzer` with a unique suffix. The following services are created and easily identified by the `wvda-` prefix:
    * wvda-visual-recognition

> Make note of the `watson-vehicle-damage-analyzer` URL route - it will be required for later use in the mobile app.

## Deploy the server application locally

Perform steps 1-9:

1. [Clone the repo](#1-clone-the-repo)
2. [Create the Watson Visual Recognition service](#2-create-the-watson-visual-recognition-service)
3. [Add Visual Recoginition API key to .env file](#3-add-visual-recoginition-api-key-to-env-file)
4. [Install dependencies and run server](#4-install-dependencies-and-run-server)
5. [Update config values for the Mobile App and install Build dependencies](#5-update-config-values-for-the-mobile-app-and-install-build-dependencies)

6. Build the mobile app (Perform either 6a or 6b)

    6a. [Install dependencies to build the mobile application for Android](#6a-install-dependencies-to-build-the-mobile-application-for-android)

    6b. [Run mobile application build in Docker container for Android](#6b-run-mobile-application-build-in-docker-container-for-android)

7. Deploy to Android using Cordova

   7a.[Add Android platform and plug-ins](#7a-add-android-platform-and-plug-ins)

   7b. [Setup your Android device](#7b-setup-your-android-device)

   7c. [Build and run the mobile app](#7c-build-and-run-the-mobile-app)

8. Deploy to iOS using Cordova

   8a. [Add iOS platform and plugins](#8a-add-ios-platform-and-plugins)

   8b. [Setup your iOS project](#8b-setup-your-ios-project)

   8c. [Deploy the app to iOS device or emulator](#8c-deploy-the-app-to-ios-device-or-emulator)

## 1. Clone the repo

Clone the `watson-vehicle-damage-analyzer` repo locally. In a terminal, run:

```bash
git clone https://github.com/IBM/watson-vehicle-damage-analyzer.git
cd watson-vehicle-damage-analyzer
```

## 2. Create the Watson Visual Recognition service

Create a Watson Visual Recognition service using IBM Cloud, a free `lite` plan and a `Standard` plan is available for both. Ensure the service is named `wvda-visual-recognition`. Once created, click the *Launch tool* button to start creating your own classifiers.

* [**Watson Visual Recognition**](https://cloud.ibm.com/catalog/services/visual-recognition)

|   |   |
| - | - |
| ![create-vis-rec-service-gif](https://github.com/IBM/pattern-utils/blob/master/visual-recognition/create-vis-rec-service.gif) | ![add-images-to-vis-rec-gif](https://github.com/IBM/pattern-utils/blob/master/visual-recognition/add-images-to-vis-rec.gif) |

### Creating a classifier with Watson Visual Recognition

> NOTE: The following section is not required to be performed but serves to educate the reader.

For this code pattern, we programmatically call Watson Visual Recognition APIs to create classifiers. See the following code from [watson-visRec-setup.js](https://github.com/IBM/watson-vehicle-damage-analyzer/blob/2da8fe1a0c63a86397a6ff2887267e9be3ec447b/server/lib/watson-visRec-setup.js#L82-L98), further highlighted below:

```javascript
var createClassifierParams = {
    name: 'vehicleDamageAnalyzer',
    BrokenWindshield_positive_examples: fs.createReadStream('./data/BrokenWindshield.zip'),
    FlatTire_positive_examples: fs.createReadStream('./data/FlatTire.zip'),
    MotorcycleAccident_positive_examples: fs.createReadStream('./data/MotorcycleAccident.zip'),
    Vandalism_positive_examples: fs.createReadStream('./data/Vandalism.zip'),
    negative_examples: fs.createReadStream('./data/Negatives.zip')
    }
this.vizRecClient.createClassifier(createClassifierParams, (err, response) => {
    if (err) {
    console.error('Failed to create VisualRecognition classifier.');
    return reject(err);
    } else {
    console.log('Created VisualRecognition classifier: ', response);
    resolve(response);
    }
});
```

Since the server side application creates these classifiers upon start up we do not need to create them ourselves. If this was not the case, we could use the Watson Visual Recognition Tool provided by Watson Studio, or even use cURL calls, like so:

```bash
curl -X POST -u "apikey:{your_api_key}" \
--form "BrokenWindshield_positive_examples=@BrokenWindshield.zip" \
--form "FlatTire_positive_examples=@FlatTire.zip" \
--form "MotorcycleAccident_positive_examples=@MotorcycleAccident.zip" \
--form "Vandalism_positive_examples=@Vandalism.zip" \
--form "negative_examples=@Negatives.zip" \
--form "name=vehicleDamageAnalyzer" \
"https://gateway.watsonplatform.net/visual-recognition/api/v3/classifiers?version=2018-03-19"
```

## 3. Add Visual Recoginition API key to .env file

To use the Visual Recognition service you will need the IAM apikey.

To retrieve the key in Watson Studio, scroll down to the list of `Visual Recognition` services,
find the service you've created and click on the name.

Go to the `Credentials` tab and click `Show credential` for existing creds of `New credential +` if necessary.

![](https://github.com/IBM/pattern-images/blob/master/visual-recognition/WatsonStuidioVizRecIAMcred.png)

In IBM Cloud it will look like this:

![](https://github.com/IBM/pattern-images/blob/master/visual-recognition/IBMcloudVizRecIAMcred.png)

Rename the ``watson-vehicle-damage-analyzer/server/env.example`` file to ``watson-vehicle-damage-analyzer/server/.env`` and add the apikey:

```bash
# Watson Visual Recognition
VISUAL_RECOGNITION_IAM_APIKEY=<add_apikey>
```

## 4. Install dependencies and run server

#### If you used the Deploy to IBM Cloud button...

If you used ``Deploy to IBM Cloud``, the setup is automatic.

#### If you decided to run the app locally...

* Install [Node.js and npm](https://nodejs.org/en/download/) (`npm` version 4.5.0 or higher)

* Install the app dependencies and start the app:

```bashj
cd server
npm install
npm start
```

#### Test the application from a browser

If you are unable to, or do not want to build the mobile app, you can point a browser to the server and test the application.

* For a server running locally, open a browser tab to `localhost:<port>`.
* For a server running on IBM Cloud, open a browser tab and point it to the URL for your server `<IBM_Cloud_server_URL:port>`

The default port is `3000`

You can then upload a local picture, i.e one from this repository in `test/data/`

## 5. Update config values for the Mobile App and install Build dependencies

Edit `mobile/www/config.json` and update the setting with the values retrieved previously.
> NOTE: You will need the full URL to run on a mobile phone, so be sure to include `https://` in the URL.

```javascript
"SERVER_URL": "https://<put_server_url_here>"
```

For this code pattern, you'll need to install the prerequisites, by following their respective documentation:

* [Cordova](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)
* [Gradle](https://gradle.org/install/)

## 6a. Install dependencies to build the mobile application for Android

Building the mobile application requires a few dependencies that you need to manually install yourself.
If you are running [Docker](https://docs.docker.com/engine/installation/) you can build the mobile app in a container by skipping to [Run mobile application build in Docker container for Android](#6b-run-mobile-application-build-in-docker-container-for-android)

### Using manually-installed dependencies

For manually building an Android app, you'll need to install these prerequisites, by following their respective documentation:

* [Java Development Kit (JDK)](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [Android Studio](https://developer.android.com/studio/), which includes Android tools and gives you access to Android SDKs

You'll need to install the specific SDK appropriate for your mobile device. From `Android Studio`, download and install the desired API Level for the SDK. We are using Android API Level 23 as this is widely supported on most phones as of January, 2018. To do this:

* Launch `Android Studio` and accept all defaults.
* Click on the `SDK Manager` icon in the toolbar.
* Navigate to `Appearance & Behavior` -> `System Settings` -> `Android SDK`
* Select Android 6.0 (Marshmallow) (API Level 23).
* Click apply to download and install.

> The ``mobile/config.xml`` is configured to build for Android API Level 23. Adjust this if you wish to build for a different API:
```javascript
<preference name="android-targetSdkVersion" value="23" />
```

Once you have completed all of the required installs and setup, you will need the following environment variables set appropriately for your platform:

* `JAVA_HOME`
* `ANDROID_HOME`
* `ANDROID_SDK_HOME`

#### How to determine proper values for environment variables:

Open `Android Studio` and navigate to `File` -> `Project Structure` -> `SDK
Location`. This location value will serve as the base for your environment variables. For example, if the location is `/users/joe/Android/sdk`, then:

```bash
export ANDROID_HOME=/users/joe/Android/sdk
export ANDROID_SDK_HOME=/users/joe/Android/sdk/platforms/android-<api-level>
export JAVA_HOME=`/usr/libexec/java_home`
```

get the exact path for `JAVA_HOME:`
```bash
/usr/libexec/java_home
```

For our example, we then add these to ``$PATH``. (your locations may vary)
```bash
export PATH=${PATH}:/users/joe/Android/sdk/platform-tools:/users/joe/Android/sdk/tools:/Library/Java/JavaVirtualMachines/jdk1.8.0_151.jdk/Contents/Home
```

## 6b. Run mobile application build in Docker container for Android

If you are running [Docker](https://docs.docker.com/engine/installation/), build the mobile app in a Docker container.

Either download the image:
```bash
docker pull scottdangelo/cordova_build
```

Or build locally:
```bash
docker build -t cordova_build .
```

Now create the following alias for `cordova` and the commands for cordova will run inside the container. Use `cordova_build` in place of `scottdangelo/cordova_build` if you have built the container locally.

```bash
alias cordova='docker run -it --rm --privileged  -v $PWD:/mobile scottdangelo/cordova_build cordova'
```

> The ``mobile/config.xml`` file is configured to build for Android API Level 23. Adjust this if you wish to build for a different API:
```bash
<preference name="android-targetSdkVersion" value="23" />
```

## 7a. Add Android platform and plug-ins

Adjust the path for `watson-vehicle-damage-analyzer/mobile` based on your present working directory.

Start by adding the Android platform as the target for your mobile app.

```bash
cd watson-vehicle-damage-analyzer/mobile
cordova platform add android
```

Ensure that everything has been installed correctly:

```bash
cordova requirements
```

You should see requirements installed for whichever appliction you are building for, `ios` or `android`. So for android, I see:

```bash
Requirements check results for android:
Java JDK: installed 1.8.0
Android SDK: installed true
Android target: installed android-26
Gradle: installed /usr/share/gradle/bin/gradle

Requirements check results for ios:
Apple macOS: not installed
Cordova tooling for iOS requires Apple macOS
(node:1) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Some of requirements check failed
```

Finally, install the plugins required by the application:

```bash
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-file-transfer
```

## 7b. Setup your Android device

In order to run the application on your Android device, you will need to be prepared to transfer the application's `.apk` file to your device (created in the next step). There are multiple ways for developers to achieve this.

Android Studio will handle the transfer for you if you tether your Android device to your computer, and enable both `developer options` and `web debugging`.

> Please refer to documentation on your specific phone to set these options.

For Mac users, [Android File Transfer](https://www.android.com/filetransfer/) will facilitate simple file transfers between your computer and Android device.

## 7c. Build and run the mobile app

```bash
cd watson-vehicle-damage-analyzer/mobile
cordova build android
```

An `.apk` file should appear at `watson-vehicle-damage-analyzer/mobile/platforms/android/app/build/outputs/apk/debug/app-debug.apk` `watson-vehicle-damage-analyzer/mobile/platforms/android/build/outputs/apk/android-debug.apk`, which contains the Android application.

You can then either manually transfer the `.apk` to your device and run it yourself, or if your device is tethered (as described in the previous step), then you can run:

```bash
cordova run android
```

At this point, the app named `Watson Vehicle Damage Analyzer` should be on your mobile device. Use the camera icon to take a photo of an automobile windshield, tire, vandalism, or of a motorcycle. The mobile application will send the image to the server after you click on the `check mark`, and the server will use Watson to analyze the image and fetch the results.

## 8a. Add iOS platform and plugins

Install the iOS deployment tools

```bash
npm install -g ios-sim
npm install -g ios-deploy
```

Add the iOS platform and build. This will create an iOS folder in `platform` directory with all necessary files to run in emulator or iOS device

```bash
cordova platform add ios
cordova prepare              # or "cordova build"
```
All cordova plugins are configured in [mobile/config.xml](mobile/config.xml) and will be installed when you create the platform and build.

## 8b. Setup your iOS project

In order to run the iOS project that was created from step #8a, we need to first create the `provisioning file,app IDs and certificates` from `Xcode`. You need to have an apple login which is free if you have an iOS device. Go to `Xcode>Preferences>Accounts` and add your apple login. This will create a `Personal Team` profile which can be used to sign your project.

If you get `error: exportArchive: No profiles for ‘com.watson.vehicledamageanalyzer’ were found`. You need to select project in Xcode  and change the `bundle identifier` to a unique one. Also change the widget `id` in [mobile/config.xml](mobile/config.xml) to the same one in Xcode

for example: change `com.watson.vehicle-damage-analyzer` to your new bundle identifier name `com.foo.vehicle-damage-analyzer`

## 8c. Deploy the app to iOS device or emulator

Deploy the app using the following steps, make sure your device in unlocked when deploying.

To deploy the app on a connected iOS device:

```bash
cordova run ios --device
```

# Sample Output

<img src="doc/source/images/output1.png" width="250">

# Troubleshooting

* Test the Visual Recognition service using the instructions in [test/README.md](test/README.md)

* `cordova run android` error: Failure [INSTALL_FAILED_UPDATE_INCOMPATIBLE]

> The `Vehicle Damage Analyzer` app is already installed on your phone and incompatible with the version you are now trying to run. Uninstall the current version and try again.

* `cordova run android` error: No target specified and no devices found, deploying to emulator

> Ensure that your phone is plugged into your computer and you can access it from the Android File Transfer utility (see Step #6 above).

* Error: Server error, status code: 502, error code: 10001, message: Service broker error: {"description"=>"Only one free key is allowed per organization. Contact your organization owner to obtain the key."}

> Only one free key is allowed per organization. Binding the service to an application triggers a process that tries to allocate a new key, which will get rejected. If you already have an instance of Visual Recognition and an associated key, you can bind that instance to your application or update the API key in your server code to tell the app which key to use.

* Deploy or Dashboard shows app is not running

> You may see logs in the Deploy Stage that indicate that the app has crashed and cannot start:

```bash
Starting app watson-vehicle-damage-analyzer-20171206202105670 in org scott.dangelo / space dev as scott.dangelo@ibm.com...

0 of 1 instances running, 1 starting
0 of 1 instances running, 1 starting
0 of 1 instances running, 1 starting
0 of 1 instances running, 1 starting
0 of 1 instances running, 1 starting
0 of 1 instances running, 1 starting
0 of 1 instances running, 1 starting
0 of 1 instances running, 1 starting
0 of 1 instances running, 1 crashed
FAILED
Error restarting application: Start unsuccessful

TIP: use 'cf logs watson-vehicle-damage-analyzer-20171206202105670 --recent' for more information

Finished: FAILED
```

> OR you may see in the IBM Cloud console that the app is `Not Running`:

![App not running](doc/source/images/app-not-running.png)

> Both of these can be spurious errors. Click the `Visit App URL` link in the IBM Cloud console, or try `Runtime` -> `SSH`, or simply test the app to see if it is running.

# Links
* [Demo on Youtube](https://youtu.be/rVL1HsbsdBI)
* [Watson Node.js SDK](https://github.com/watson-developer-cloud/node-sdk)

# Learn more

* **Artificial Intelligence Code Patterns**: Enjoyed this Code Pattern? Check out our other [AI Code Patterns](https://developer.ibm.com/technologies/artificial-intelligence/).
* **AI and Data Code Pattern Playlist**: Bookmark our [playlist](https://www.youtube.com/playlist?list=PLzUbsvIyrNfknNewObx5N7uGZ5FKH0Fde) with all of our Code Pattern videos
* **With Watson**: Want to take your Watson app to the next level? Looking to utilize Watson Brand assets? [Join the With Watson program](https://www.ibm.com/watson/with-watson/) to leverage exclusive brand, marketing, and tech resources to amplify and accelerate your Watson embedded commercial solution.

# License

This code pattern is licensed under the Apache Software License, Version 2.  Separate third party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1 (DCO)](https://developercertificate.org/) and the [Apache Software License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache Software License (ASL) FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
