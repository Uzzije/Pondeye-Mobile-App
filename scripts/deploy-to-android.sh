#!/usr/bin/env bash
sudo chown -R $USER:$GROUP /Users/Administrator/DEVELOPMENT/pondeye/platforms/
sudo chown -R $USER:$GROUP /Users/Administrator/DEVELOPMENT/pondeye/plugins/
cordova plugin rm cordova-plugin-console
mv /Users/Administrator/DEVELOPMENT/pondeye/Pondeye.apk ~/Trash
mv /Users/Administrator/DEVELOPMENT/pondeye/platforms/android/build/outputs/apk/android-release-unsigned.apk ~/Trash
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -tsa http://tsa.safecreative.org/ -digestalg \
SHA1 -keystore my-release-key.keystore \
/Users/Administrator/DEVELOPMENT/pondeye/platforms/android/build/outputs/apk/android-release-unsigned.apk pondeye_key
~/Library/Android/sdk/build-tools/25.0.2/zipalign -v 4 \
/Users/Administrator/DEVELOPMENT/pondeye/platforms/android/build/outputs/apk/android-release-unsigned.apk Pondeye.apk