FROM ubuntu:16.04

# This allows us to fetch and unpack things later.
RUN apt-get update \
    && apt-get install -y \
    wget \
    xz-utils \
    zip

# Install Node.js + npm.
RUN wget https://nodejs.org/dist/v6.11.3/node-v6.11.3-linux-x64.tar.xz -O /tmp/node.tar.xz \
    && cd /usr/local/ \
    && tar --strip-components 1 -xf /tmp/node.tar.xz \
    && rm /tmp/node.tar.xz

# Install JDK.
RUN apt-get install -y openjdk-8-jdk gradle
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/

# Install Android tools. This is the only part of Android Studio that we need.
RUN wget https://dl.google.com/android/repository/sdk-tools-linux-3859397.zip -O /tmp/android-sdk.zip \
    && mkdir -p /opt/android \
    && cd /opt/android \
    && unzip /tmp/android-sdk.zip \
    && rm /tmp/android-sdk.zip
ENV PATH ${PATH}:/opt/android/tools/bin

# Install Android SDK.
RUN sdkmanager --update \
    && yes | sdkmanager \
    "build-tools;26.0.1" \
    "platforms;android-25"

# Install Cordova, and opt out of telemetry reporting. If we don't opt-out now,
# then the user will face an interactive prompt when building the image later.
RUN npm install -g cordova \
    && cordova telemetry off

WORKDIR /mobile
# This can be overridden by the user, but assumes that the repo's mobile/
# directory is volume-mounted to /mobile in the container, using `docker run -v
# mobile:/mobile`, for example.
CMD \
    cordova platform add android || true ; \
    cordova requirements ; \
    cordova build android
