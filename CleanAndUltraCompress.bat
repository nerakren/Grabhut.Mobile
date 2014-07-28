@echo off
echo.
echo Deleting bin folders
echo.
FOR /F "tokens=*" %%G IN ('DIR /B /AD /S bin') DO RMDIR /S /Q "%%G"
echo.
echo Deleting obj folders
echo.
FOR /F "tokens=*" %%G IN ('DIR /B /AD /S obj') DO RMDIR /S /Q "%%G"
echo.
for %%* in (.) do set CurrDirName=%%~n*
echo.
echo Deleting %CurrDirName%.7z file
del %CurrDirName%.7z
echo.
echo Compressing to archieve %CurrDirName%.7z
echo.
echo.Changing the path to C:\Program Files\7-Zip\
set PATH=%PATH%;C:\Program Files\7-Zip\
echo.
TIMEOUT /T 5 /NOBREAK
echo.
7z a -t7z %CurrDirName% * -m0=BCJ2 -m1=LZMA2:d=1024m -aoa