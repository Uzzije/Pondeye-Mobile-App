chmod 777 /Users/Administrator/DEVELOPMENT/pondeye/platforms/android/
sudo cp /Users/Administrator/DEVELOPMENT/pondeye/gradle-2.14.1-all.zip /Users/Administrator/DEVELOPMENT/pondeye/platforms/android/gradle
export CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL=/Users/Administrator/DEVELOPMENT/pondeye/platforms/android/gradle/gradle-2.14.1-all.zip
sudo ionic cordova build android --stacktrace
sudo ionic cordova run android --stacktrace 
