echo off
for /D %%i in (*) do (
    echo %%i
    cd %%i
    call npm ci
    cd -
)
