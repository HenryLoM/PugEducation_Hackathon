import sqlite3
from contextlib import closing

DB_PATH = 'project.db'

def init_db():
    with closing(sqlite3.connect(DB_PATH)) as conn:
        c = conn.cursor()
        # User table
        c.execute('''CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT,
            nickname TEXT,
            created_at TEXT,
            bio TEXT,
            google_registered INTEGER DEFAULT 0,
            notifications_enabled INTEGER DEFAULT 1,
            level INTEGER DEFAULT 1,
            learning_progress TEXT DEFAULT '{}'
        )''')
        # Settings table
        c.execute('''CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            key TEXT,
            value TEXT,
            FOREIGN KEY(user_id) REFERENCES user(id)
        )''')

        # Memory table (chat history, actions)
        c.execute('''CREATE TABLE IF NOT EXISTS memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            role TEXT,
            content TEXT,
            timestamp TEXT,
            FOREIGN KEY(user_id) REFERENCES user(id)
        )''')
        conn.commit()

init_db()
