@echo off
title ShopEasy Launcher

echo ==================================
echo       STARTING SHOP EASY
echo ==================================

start "ShopEasy Backend" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location 'C:\Users\LENOVO\Downloads\ShopEasy\backend'; npm run dev"

timeout /t 3 /nobreak >nul

start "ShopEasy Frontend" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location 'C:\Users\LENOVO\Downloads\ShopEasy'; npm run dev"

timeout /t 5 /nobreak >nul

start "" "http://localhost:5173/ShopEasy/"

echo ShopEasy started!
