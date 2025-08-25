#!/usr/bin/env bash
set -euo pipefail

# Универсальный скрипт для macOS / Linux
# Запускает установку зависимостей и старт dev-серверов для подпроектов: cards, main (backend), tasks

ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "[run_all_mac.sh] Рабочая директория: $ROOT"

start_bg_process() {
	# $1 = name, $2 = command, runs in subshell
	echo "[$1] запуск: $2"
	bash -c "$2" &
	pid=$!
	echo "[$1] PID=$pid"
}

echo "--- cards ---"
if [ -f "$ROOT/cards/package.json" ]; then
	(cd "$ROOT/cards" && npm install)
	start_bg_process "cards" "cd '$ROOT/cards' && npm run dev"
else
	echo "[cards] package.json не найден — пропускаю"
fi

echo "--- main (backend) ---"
if [ -f "$ROOT/main/backend/requirements.txt" ]; then
	(cd "$ROOT/main" && (python3 -m venv .venv || python -m venv .venv) && source .venv/bin/activate && pip install --upgrade pip && pip install -r backend/requirements.txt)
	start_bg_process "main-backend" "cd '$ROOT/main' && source .venv/bin/activate && python backend/main.py"
else
	echo "[main/backend] requirements.txt не найден — пропускаю"
fi

echo "--- tasks ---"
if [ -f "$ROOT/tasks/package.json" ]; then
	(cd "$ROOT/tasks" && npm install)
	start_bg_process "tasks" "cd '$ROOT/tasks' && npm run dev"
else
	echo "[tasks] package.json не найден — пропускаю"
fi

echo "Все команды отправлены в фон. Используйте \`ps aux | grep node\` или \`ps aux | grep python\` для проверки процессов."
wait
