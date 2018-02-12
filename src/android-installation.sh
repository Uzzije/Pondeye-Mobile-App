cordova plugin rm cordova-plugin-console
sudo corodava build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore /Users/Administrator/DEVELOPMENT/pondeye/platforms/android/build/outputs/apk/android-release-unsigned.apk pondeye_key
rm -f Pondeye.apk
/Users/Administrator/Library/Android/sdk/build-tools/25.0.2/zipalign -v 4 /Users/Administrator/DEVELOPMENT/pondeye/platforms/android/build/outputs/apk/android-release-unsigned.apk Pondeye.apk
