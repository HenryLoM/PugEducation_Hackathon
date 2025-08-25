@echo off
REM Универсальный скрипт для Windows (cmd.exe)
SETLOCAL ENABLEDELAYEDEXPANSION

SET ROOT=%~dp0
echo [run_all_windows.bat] Рабочая директория: %ROOT%

REM Функция: запуск команды в новом окне (start)
echo --- cards ---
IF EXIST "%ROOT%cards\package.json" (
  pushd "%ROOT%cards"
  echo Установка зависимостей (cards)...
  call npm install
  echo Запуск dev-сервера (cards) в новом окне...
  start "cards" cmd /k "npm run dev"
  popd
) ELSE (
  echo [cards] package.json не найден — пропускаю
)

echo --- main (backend) ---
IF EXIST "%ROOT%main\backend\requirements.txt" (
  pushd "%ROOT%main"
  echo Создание виртуального окружения и установка зависимостей (main)...
  IF NOT EXIST "%ROOT%main\.venv\Scripts\activate.bat" (
    python -m venv .venv
  )
  echo Активация и установка...
  start "main-backend" cmd /k "%ROOT%main\.venv\Scripts\activate.bat && pip install --upgrade pip && pip install -r backend\requirements.txt && python backend\main.py"
  popd
) ELSE (
  echo [main/backend] requirements.txt не найден — пропускаю
)

echo --- tasks ---
IF EXIST "%ROOT%tasks\package.json" (
  pushd "%ROOT%tasks"
  echo Установка зависимостей (tasks)...
  call npm install
  echo Запуск dev-сервера (tasks) в новом окне...
  start "tasks" cmd /k "npm run dev"
  popd
) ELSE (
  echo [tasks] package.json не найден — пропускаю
)

echo Все команды запущены в отдельных окнах. Закройте окна или используйте диспетчер задач для остановки.
ENDLOCAL
