# Проект — Полное руководство (от А до Я)

Добро пожаловать! Это подробное, структурированное и аккуратно оформленное руководство по проекту, содержащее всё необходимое для разработки, запуска и отладки на macOS/Linux и Windows.

## Содержание

- Введение
- Структура репозитория
- Требования и установка (macOS / Linux / Windows)
- Быстрый старт (локально)
- Скрипты запуска (macOS и Windows)
- Советы по отладке и тестированию
- Частые проблемы и решения
- Контакты и дальнейшие шаги

---

## Введение

Этот репозиторий содержит несколько подпроектов: `cards`, `main` (backend) и `tasks`. Каждый из них представляет отдельный фронтенд/бэкенд модуль с собственным package.json / requirements.txt.

Цель README — дать однозначные инструкции по установке и запуску, а также удобные скрипты для параллельного старта всех сервисов.

---

## Структура репозитория (вкратце)

- `cards/` — фронтенд (vite/react/ts)
- `main/` — содержит бэкенд в `main/backend/` (python) и фронтенд в `main/src`
- `tasks/` — фронтенд модуль с генераторами/оценкой задач
- `run_all_mac.sh` — скрипт для macOS / Linux (уже в корне)
- `run_all_windows.bat` — скрипт для Windows (cmd)

---

## Требования и установки (подробно, с ссылками)

Ниже перечислено всё стороннее ПО, которое может понадобиться, с короткими командами установки и ссылками на официальные ресурсы.

Общее ПО
- Git — https://git-scm.com/
- Node.js (рекомендуется LTS >= 18) — https://nodejs.org/
- npm (идёт в комплекте с Node.js) — https://docs.npmjs.com/
- Python 3.8+ (для `main` backend) — https://www.python.org/downloads/

macOS / Linux (рекомендуется)
- Bash (обычно есть в системе)
- Рекомендация по управлению Node.js: nvm — https://github.com/nvm-sh/nvm
	- Установка (пример для bash/zsh):

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.nvm/nvm.sh
nvm install --lts
nvm use --lts
```

- Homebrew (macOS) — https://brew.sh/
	- Установка Python через Homebrew (если предпочитаете):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install python
```

Windows
- Рекомендуемая утилита управления версиями Node: nvm-windows — https://github.com/coreybutler/nvm-windows
	- Скачайте релиз-установщик (installer) из раздела Releases и установите.
- Python: официальный инсталлятор — https://www.python.org/downloads/windows/
	- При установке на Windows поставьте галочку "Add Python to PATH".

Проверка установок (после установки):

```bash
node --version
npm --version
python --version
```

Виртуальные окружения Python
- Для backend мы используем стандартные venv. Команды (macOS/Linux):

```bash
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt
```

Windows (cmd.exe):

```cmd
python -m venv .venv
.venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r backend\requirements.txt
```

Примечания
- Если у вас нет прав на установку глобально, используйте nvm / nvm-windows для Node и виртуальные окружения для Python.
- Ссылки приведены к официальным репозиториям и сайтам, используйте их для получения актуальных инструкций и релизов.

---

## Установка и запуск — пошагово

Ниже — последовательность команд для быстрой настройки. Выполняйте шаги в корне репозитория (где лежит этот README).

### macOS / Linux (bash)

1) Сделать исполняемым скрипт (если ещё не сделан):

```bash
chmod +x ./run_all_mac.sh
```

2) Запустить скрипт:

```bash
./run_all_mac.sh
```

Скрипт попробует установить зависимости в папках `cards` и `tasks` (npm install) и создаст виртуальное окружение для `main/backend` и установит зависимости из `requirements.txt`, затем стартует процессы в фоне.

### Windows (cmd.exe)

1) Запустить `run_all_windows.bat` двойным кликом или в командной строке:

```cmd
cd \path\to\project
run_all_windows.bat
```

Скрипт откроет отдельные окна командной строки для каждого сервиса (cards, tasks, main-backend).

---

## Скрипты

- `run_all_mac.sh` — запуск установки и dev-серверов в фоне (bash)
- `run_all_windows.bat` — аналог для Windows (cmd.exe)

Если вы хотите более гибкий способ запуска (tmux, iTerm, PowerShell), рассмотрите использование утилит вроде `concurrently`, `pm2` или `docker-compose`.

---

## Советы по отладке

- Проверьте логи в терминалах/окнах. Для фоновых процессов на macOS используйте `ps aux | grep node` и `ps aux | grep python`.
- Если dev-серверы не стартуют, зайдите в соответствующую папку и запустите `npm run dev` вручную — посмотрите на ошибки сборки.
- Для backend: убедитесь, что активировали виртуальное окружение и установили зависимости: `python -m venv .venv && source .venv/bin/activate && pip install -r backend/requirements.txt`.

---

## Частые проблемы и решения

- "npm: command not found" — установите Node.js и npm, добавьте в PATH.
- "python: command not found" — установите Python 3 и добавьте в PATH.
- Права на исполнение shell-скрипта — используйте `chmod +x run_all_mac.sh`.

---

## Дальнейшие шаги и улучшения (рекомендации)

- Добавить `docker-compose.yml` для воспроизводимого окружения.
- Добавить `Makefile` или `justfile` для удобных команд.
- Рассмотреть замену `.bat` на PowerShell-скрипт `run_all_windows.ps1` для современного Windows-подхода.

---

## Контакты

Если нужно — могу помочь настроить docker-compose, PowerShell-версию или унифицировать запуск через `concurrently`.

---

Спасибо, что используете этот проект! Удачной разработки.
