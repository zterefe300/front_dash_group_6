@echo off
REM FrontDash Backend Runner Script
REM This script runs the Spring Boot backend application locally on Windows

setlocal enabledelayedexpansion

echo [92m========================================[0m
echo [92m  Starting FrontDash Backend[0m
echo [92m========================================[0m
echo.

REM Get the script directory and project root
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%..\..\"
set "BACKEND_DIR=%PROJECT_ROOT%backend"

REM Normalize paths
pushd "%PROJECT_ROOT%"
set "PROJECT_ROOT=%CD%"
popd

pushd "%BACKEND_DIR%"
set "BACKEND_DIR=%CD%"
popd

REM Load .env.local if exists
set "ENV_FILE=%PROJECT_ROOT%\.env.local"

if exist "%ENV_FILE%" (
    echo [92mLoading environment variables from .env.local[0m
    for /f "usebackq tokens=*" %%a in ("%ENV_FILE%") do (
        set "line=%%a"
        REM Skip lines starting with # or empty lines
        if not "!line:~0,1!"=="#" if not "!line!"=="" (
            set "%%a"
        )
    )
) else (
    echo [93mNo .env.local found. Using system environment variables.[0m
)
echo.

REM Check if backend directory exists
if not exist "%BACKEND_DIR%" (
    echo [91mBackend directory not found: %BACKEND_DIR%[0m
    exit /b 1
)

REM Check if Java is available
where java >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [91mJava is not installed or not in PATH[0m
    echo [93mPlease install Java 17 or higher[0m
    exit /b 1
)

REM Check Java version
for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VERSION_STRING=%%g
)
set JAVA_VERSION_STRING=%JAVA_VERSION_STRING:"=%
for /f "delims=. tokens=1" %%v in ("%JAVA_VERSION_STRING%") do set JAVA_VERSION=%%v

if %JAVA_VERSION% LSS 17 (
    echo [91mJava 17 or higher is required. Current version: %JAVA_VERSION%[0m
    exit /b 1
)

echo [92mJava %JAVA_VERSION% detected[0m

REM Check if Maven is available
set "MAVEN_CMD=mvn"
if exist "%BACKEND_DIR%\mvnw.cmd" (
    set "MAVEN_CMD=%BACKEND_DIR%\mvnw.cmd"
    echo [93mUsing Maven wrapper...[0m
) else (
    where mvn >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo [91mMaven is not installed or not in PATH[0m
        echo [93mPlease install Maven 3.6 or higher[0m
        exit /b 1
    )
    echo [93mUsing system Maven...[0m
)

echo [92mMaven detected[0m
echo.

REM Navigate to backend directory
cd /d "%BACKEND_DIR%"

echo [93mStarting Spring Boot application...[0m
echo [94mApplication will be available at: http://localhost:8080[0m
echo [94mSwagger UI: http://localhost:8080/swagger-ui.html[0m
echo [93mPress Ctrl+C to stop the application[0m
echo.

REM Run the application
if exist "mvnw.cmd" (
    call mvnw.cmd spring-boot:run
) else (
    call mvn spring-boot:run
)

endlocal
