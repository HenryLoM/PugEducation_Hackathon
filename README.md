# 📚 Проект — Полное руководство (от А до Я)

Добро пожаловать! Это удобное и структурированное руководство по репозиторию. Оно содержит краткие, практичные инструкции для разработки, установки и запуска на macOS/Linux и Windows.

🏆 Проект создан для VibeHackathon (Tooba), трек 3 — "Education".

## 🧭 Оглавление

- 📘 Введение
- 🗂 Структура репозитория
- ⚙️ Требования и установка
- ▶️ Быстрый старт (локально)
- 🛠️ Скрипты запуска
- 🐞 Советы по отладке и тестированию
- ❗ Частые проблемы и решения

---

## 📘 Введение

Репозиторий содержит несколько подпроектов: `cards`, `main` (backend) и `tasks`. Каждый модуль имеет собственные зависимости и конфигурацию (например, `package.json` или `requirements.txt`).

Цель этого README — помочь быстро настроить окружение и одновременно предоставить ясные шаги для запуска всех модулей разработческой среды.

---

## 🗂 Структура репозитория (вкратце)

- `cards/` — фронтенд (Vite + React + TypeScript)
- `main/` — содержит бэкенд в `main/backend/` (Python) и фронтенд в `main/src`
- `tasks/` — фронтенд модуль с генераторами и системой оценки
- `run_all_mac.sh` — скрипт для macOS / Linux
- `run_all_windows.bat` — скрипт для Windows (cmd)

---

## ⚙️ Требования и установка

Коротко: Node.js (рекомендуется LTS >=18), npm, Python 3.8+.

- Git — https://git-scm.com/
- Node.js — https://nodejs.org/
- Python 3 — https://www.python.org/downloads/

Рекомендуется использовать nvm (macOS/Linux) или nvm-windows на Windows и виртуальные окружения Python (`venv`).

Примеры команд (macOS/Linux, zsh/bash):

```bash
# установить зависимости фронтендов
cd cards && npm install && cd -
cd tasks && npm install && cd -

# создать и активировать виртуenv для backend
cd main/backend
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cd -
```

Windows (cmd.exe) — аналогично, но с путями Windows и активацией `.venv\Scripts\activate.bat`.

---

## ▶️ Быстрый старт (локально)

В корне репозитория выполните (macOS/Linux):

```bash
chmod +x ./run_all_mac.sh
./run_all_mac.sh
```

На Windows откройте `run_all_windows.bat` или выполните его из командной строки.

Скрипты попытаются установить зависимости для `cards` и `tasks`, создать виртуальное окружение для `main/backend` и запустить сервисы в dev-режиме.

---

## 🛠️ Скрипты

- `run_all_mac.sh` — установка зависимостей и параллельный запуск dev-серверов (macOS/Linux)
- `run_all_windows.bat` — аналог для Windows (cmd)

Если нужна более гибкая оркестрация, рассмотрите `concurrently`, `pm2` или `docker-compose`.

---

## 🐞 Советы по отладке

- Проверяйте логи терминалов и вывод dev-серверов.
- Для фоновых процессов на macOS используйте `ps aux | grep node` и `ps aux | grep python`.
- Если фронтенд не собирается, зайдите в соответствующую папку и запустите `npm run dev` вручную.
- Для backend: убедитесь, что виртуальное окружение активно и установлены зависимости.

---

## ❗ Частые проблемы и решения

- "npm: command not found" — установите Node.js и npm, добавьте в PATH.
- "python: command not found" — установите Python 3 и добавьте в PATH.
- Нет прав на запуск shell-скрипта — выполните `chmod +x run_all_mac.sh`.

---

Спасибо за использование проекта — успехов в обучении!
