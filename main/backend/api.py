from fastapi import APIRouter, Request, Body
from pydantic import BaseModel
import sqlite3
from datetime import datetime
DB_PATH = 'project.db'

router = APIRouter()

# DEBUG: получить все nickname и learning_progress
@router.get("/debug-users")
def debug_users():
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		c.execute("SELECT id, nickname, learning_progress FROM user")
		rows = c.fetchall()
		return [{"id": row[0], "nickname": row[1], "learning_progress": row[2]} for row in rows]

from fastapi import APIRouter, Request, Body
from pydantic import BaseModel
import sqlite3
from datetime import datetime
DB_PATH = 'project.db'

router = APIRouter()

class ProgressUpdate(BaseModel):
	user_id: int
	learning_progress: str

@router.post("/progress", response_model=bool)
def update_progress(data: ProgressUpdate):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		c.execute("UPDATE user SET learning_progress=? WHERE id=?", (data.learning_progress, data.user_id))
		conn.commit()
		return True

# --- Registration & Auth ---
# Separate model for registration that includes password

@router.get("/profile/{user_id}")
def get_profile_by_id(user_id: int):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		c.execute("SELECT nickname, bio, google_registered, level, learning_progress FROM user WHERE id=?", (user_id,))
		row = c.fetchone()
		if not row:
			return {}
		return {
			"name": row[0],
			"bio": row[1],
			"google_registered": row[2],
			"level": row[3],
			"learning_progress": row[4],
		}
@router.get("/achievements/{user_id}")
def get_achievements(user_id: int):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
from fastapi import APIRouter, Request
from pydantic import BaseModel
import sqlite3
from datetime import datetime
DB_PATH = 'project.db'

router = APIRouter()

# --- Registration & Auth ---
# Separate model for registration that includes password

class UserCreate(BaseModel):
	email: str
	nickname: str
	password: str = ""  # Empty string allowed for OAuth users
	bio: str = ""
	avatar: str | None = None
	google_registered: int = 0

	class Config:
		extra = "ignore"  # Ignore unexpected fields

# Public user info response model (without password)

class User(BaseModel):
	email: str
	nickname: str
	bio: str
	google_registered: int
	level: int = 1

# Registration (create)

@router.post("/user", response_model=int)
def create_or_get_user(user: UserCreate):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		# Проверяем, есть ли пользователь с таким email
		c.execute("SELECT id FROM user WHERE email=?", (user.email,))
		row = c.fetchone()
		if row:
			return row[0]  # Возвращаем id существующего пользователя
		# Если нет, создаём нового
		c.execute("INSERT INTO user (email, nickname, password, created_at, bio, google_registered) VALUES (?, ?, ?, ?, ?, ?)",
				  (user.email, user.nickname, user.password, datetime.now().isoformat(), user.bio, user.google_registered))
		conn.commit()
		return c.lastrowid

# Endpoint для поиска пользователя по email (для Google login)
@router.get("/user/by-email", response_model=int)
def get_user_by_email(email: str):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		c.execute("SELECT id FROM user WHERE email=?", (email,))
		row = c.fetchone()
		if row:
			return row[0]
		raise HTTPException(status_code=404, detail="User not found")

# --- Login endpoint ---

from fastapi import HTTPException


class LoginData(BaseModel):
	email: str
	password: str


@router.post("/login")
def login(data: LoginData):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		c.execute("SELECT id, email, nickname, bio, google_registered, level, learning_progress FROM user WHERE email=? AND password=?",
				  (data.email, data.password))
		row = c.fetchone()
		if not row:
			raise HTTPException(status_code=401, detail="Invalid credentials")
		user_id = row[0]
		# Get settings
		c.execute("SELECT key, value FROM settings WHERE user_id=?", (user_id,))
		settings = {key: value for key, value in c.fetchall()}
		# Get pet stats
		c.execute("SELECT learning_progress FROM user WHERE id=?", (user_id,))
		pet_stats = {}
		try:
			pet_stats = row[7] and eval(row[7]) if row[7] else {}
		except Exception:
			pet_stats = {}
		return {
			"id": user_id,
			"email": row[1],
			"nickname": row[2],
			"bio": row[3],
			"google_registered": row[4],
			"level": row[5],
			"settings": settings,
			"pet_stats": pet_stats,
		}

# --- Settings endpoints ---

class Setting(BaseModel):
	user_id: int
	key: str
	value: str

@router.post("/settings", response_model=int)
def set_setting(setting: Setting):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		c.execute("INSERT INTO settings (user_id, key, value) VALUES (?, ?, ?)",
				  (setting.user_id, setting.key, setting.value))
		conn.commit()
		return c.lastrowid

@router.get("/settings/{user_id}")
def get_settings(user_id: int):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		c.execute("SELECT key, value FROM settings WHERE user_id=?", (user_id,))
		return [{"key": row[0], "value": row[1]} for row in c.fetchall()]

# --- Memory endpoints (chat/actions) ---
class MemoryItem(BaseModel):
	user_id: int
	role: str
	content: str
	timestamp: str = None

@router.post("/memory", response_model=int)
def add_memory(item: MemoryItem):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		ts = item.timestamp or datetime.now().isoformat()
		c.execute("INSERT INTO memory (user_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
				  (item.user_id, item.role, item.content, ts))
		conn.commit()
		return c.lastrowid

@router.get("/memory/{user_id}")
def get_memory(user_id: int):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		c.execute("SELECT role, content, timestamp FROM memory WHERE user_id=? ORDER BY timestamp", (user_id,))
		return [
			{"role": row[0], "content": row[1], "timestamp": row[2]} for row in c.fetchall()
		]

# --- Profile & PetStats (in-memory, for compatibility) ---
from fastapi import Body

class Profile(BaseModel):
	id: int
	name: str
	bio: str = ""
	google_registered: int = 0
	level: int = 1
	learning_progress: str = "{}"

class PetStats(BaseModel):
	score: int
	hunger: int

profile = Profile(id=0, name="", bio="", google_registered=0, level=1, learning_progress="{}")
pet_stats = PetStats(score=0, hunger=100)

@router.get("/profile", response_model=Profile)
def get_profile():
	return profile

@router.post("/profile", response_model=Profile)
def set_profile(new_profile: Profile):
	global profile
	# Block email editing: do not update email
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		# Update using user ID for reliability
		c.execute("UPDATE user SET nickname=?, bio=?, google_registered=?, level=?, learning_progress=? WHERE id=?",
				  (new_profile.name, new_profile.bio, new_profile.google_registered, new_profile.level, new_profile.learning_progress, new_profile.id))
		conn.commit()
	profile = new_profile
	return profile
# --- Notification settings endpoints ---
# --- Notifications toggle endpoint ---
class NotificationsToggle(BaseModel):
	user_id: int
	enabled: int = 1

@router.get("/notifications/{user_id}")
def get_notifications(user_id: int):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		c.execute("SELECT notifications_enabled FROM user WHERE id=?", (user_id,))
		row = c.fetchone()
		return {"user_id": user_id, "enabled": row[0] if row else 1}

@router.post("/notifications", response_model=int)
def set_notifications(toggle: NotificationsToggle):
	with sqlite3.connect(DB_PATH) as conn:
		c = conn.cursor()
		c.execute("UPDATE user SET notifications_enabled=? WHERE id=?", (toggle.enabled, toggle.user_id))
		conn.commit()
		return toggle.user_id

@router.get("/petstats", response_model=PetStats)
def get_pet_stats():
	return pet_stats

@router.post("/petstats", response_model=PetStats)
def set_pet_stats(new_stats: PetStats):
	global pet_stats
	pet_stats = new_stats
	return pet_stats

class Delta(BaseModel):
	delta: int

@router.post("/score", response_model=int)
def update_score(data: Delta):
	global pet_stats
	pet_stats.score += data.delta
	return pet_stats.score

@router.post("/hunger", response_model=int)
def update_hunger(data: Delta):
	global pet_stats
	pet_stats.hunger = max(0, min(100, pet_stats.hunger + data.delta))
	return pet_stats.hunger

@router.post("/reset", response_model=PetStats)
def reset_stats():
	global pet_stats
	pet_stats = PetStats(score=0, hunger=100)
	return pet_stats

# --- AI Chat endpoint ---
@router.post("/api/chat")
async def chat_api(request: Request):
	body = await request.json()
	# Здесь должна быть интеграция с вашей AI-моделью
	# Для теста просто возвращаем echo
	return {
		"choices": [
			{"message": {"content": f"Echo: {body.get('messages', [{}])[-1].get('content', '')}"}}
		]
	}
