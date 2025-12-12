@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
echo Setting JAVA_HOME to %JAVA_HOME%
cd android
call gradlew assembleDebug > ..\build_log.txt 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Build Failed!
    exit /b %ERRORLEVEL%
)
echo Build Success!
