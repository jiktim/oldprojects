echo off
if exist display.exe del display.exe
copy %1.din display.exe
if exist cursor.exe del cursor.exe
copy %1.cin cursor.exe
