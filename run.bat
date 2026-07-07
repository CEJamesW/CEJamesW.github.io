@echo off
cls
chcp 65001 >nul
setlocal

cd /d "%~dp0"

set "MAIN_CLASS=aidai.muyun.gaokao.Main"
set "PROJECT_SQLITE_JAR=%~dp0lib\sqlite-jdbc-3.46.1.3.jar"
set "MAVEN_SQLITE_JAR=%USERPROFILE%\.m2\repository\org\xerial\sqlite-jdbc\3.46.1.3\sqlite-jdbc-3.46.1.3.jar"

set "JAVA_EXE="
set "JAVAC_EXE="
set "SQLITE_JAR="

if exist "%PROJECT_SQLITE_JAR%" (
    set "SQLITE_JAR=%PROJECT_SQLITE_JAR%"
) else (
    if exist "%MAVEN_SQLITE_JAR%" (
        set "SQLITE_JAR=%MAVEN_SQLITE_JAR%"
    ) else (
        echo [-] SQLite JDBC jar not found.
        echo [+] Expected: "%PROJECT_SQLITE_JAR%"
        pause
        exit /b 1
    )
)

if exist "%~dp0jdk\bin\java.exe" set "JAVA_EXE=%~dp0jdk\bin\java.exe"
if not defined JAVA_EXE if exist "%USERPROFILE%\.jdks\openjdk-26.0.1\bin\java.exe" set "JAVA_EXE=%USERPROFILE%\.jdks\openjdk-26.0.1\bin\java.exe"
if not defined JAVA_EXE if defined JAVA_HOME if exist "%JAVA_HOME%\bin\java.exe" set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
if not defined JAVA_EXE (
    for /f "delims=" %%I in ('where java 2^>nul') do (
        set "JAVA_EXE=%%I"
        goto found_java
    )
)
:found_java

if exist "%~dp0jdk\bin\javac.exe" set "JAVAC_EXE=%~dp0jdk\bin\javac.exe"
if not defined JAVAC_EXE if exist "%USERPROFILE%\.jdks\openjdk-26.0.1\bin\javac.exe" set "JAVAC_EXE=%USERPROFILE%\.jdks\openjdk-26.0.1\bin\javac.exe"
if not defined JAVAC_EXE if defined JAVA_HOME if exist "%JAVA_HOME%\bin\javac.exe" set "JAVAC_EXE=%JAVA_HOME%\bin\javac.exe"
if not defined JAVAC_EXE (
    for /f "delims=" %%I in ('where javac 2^>nul') do (
        set "JAVAC_EXE=%%I"
        goto found_javac
    )
)
:found_javac

if not defined JAVA_EXE (
    echo [-] Java runtime not found.
    echo [+] Install JDK 26 or configure JAVA_HOME, then rerun run.bat.
    pause
    exit /b 1
)

if defined JAVAC_EXE (
    if not exist "target" mkdir "target"
    if not exist "target\classes" mkdir "target\classes"
    dir /s /b "src\main\java\*.java" > "target\sources.txt"

    echo [*] Compiling Java sources...
    "%JAVAC_EXE%" -encoding UTF-8 -d "target\classes" @"target\sources.txt"
    if errorlevel 1 (
        echo [-] Compile failed.
        pause
        exit /b 1
    )
) else (
    if exist "target\classes\aidai\muyun\gaokao\Main.class" (
        echo [!] javac not found, using committed target\classes.
    ) else (
        echo [-] javac not found and target\classes is missing.
        echo [+] Install JDK 26 or open the project in IntelliJ IDEA to compile once.
        pause
        exit /b 1
    )
)

echo [*] Starting application...
"%JAVA_EXE%" --enable-native-access=ALL-UNNAMED -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -cp "target\classes;%SQLITE_JAR%" %MAIN_CLASS%

echo.
pause
