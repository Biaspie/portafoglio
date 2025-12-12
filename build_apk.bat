@echo off
echo Updating www folder...
copy /Y index.html www\
copy /Y script.js www\
copy /Y style.css www\
copy /Y database.js www\
copy /Y firebase-config.js www\
copy /Y login.html www\
copy /Y register.html www\

echo Syncing Capacitor...
call npx cap sync android

echo Cleaning build directory...
if exist android\app\build rmdir /s /q android\app\build

echo Building APK...
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
cd android
call gradlew assembleDebug > ..\build_log.txt 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Build Failed! Check build_log.txt
    exit /b %ERRORLEVEL%
)
echo Build Success!
