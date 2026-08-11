@echo off
cd /d "%~dp0"
echo ===================================================
echo   Updating Power BI Dashboard Portfolio Screenshots
echo ===================================================
echo.
py update_screenshots.py
echo.
echo ===================================================
echo   Finished! Refresh your browser to see updates.
echo ===================================================
pause
