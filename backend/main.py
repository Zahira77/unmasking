import os
import smtplib
from email.message import EmailMessage
from typing import Optional, List
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException, Header, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel

import models
from database import engine, SessionLocal

import re

# Load environment variables
load_dotenv()

def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_-]+', '-', s)
    return s.strip('-')

app = FastAPI(title="Verity Insights API & Real-Time Content Hub")

# Automatically create tables (against MySQL if connected, or fallback SQLite)
models.Base.metadata.create_all(bind=engine)

@app.on_event("startup")
def startup_seed_check():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = db.query(models.StartupStory).count()
        if count == 0:
            print("[*] No startup stories found in database. Automatically seeding initial database content...")
            from seed_all import seed_all_data
            seed_all_data(db, force_refresh=False)
            print("[*] Initial seed complete!")
    except Exception as e:
        print(f"[*] Startup initialization note: {e}")
    finally:
        db.close()


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WEBSOCKET CONNECTION MANAGER FOR REAL-TIME SYNC ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"[*] WebSocket client connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"[*] WebSocket client disconnected. Total clients: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        dead_connections = []
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)
        for dc in dead_connections:
            self.disconnect(dc)

manager = ConnectionManager()

@app.websocket("/api/ws/content")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive; accept optional ping or echo
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

async def broadcast_change(entity: str, action: str, item_id: Optional[int] = None):
    """Notify all connected browsers that content changed in real time."""
    payload = {
        "event": "content_updated",
        "entity": entity,
        "action": action,
        "id": item_id
    }
    await manager.broadcast(payload)


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- PYDANTIC SCHEMAS ---

class RegistrationCreate(BaseModel):
    name: Optional[str] = None
    email: str
    source: str = "subscribe"

class LessonSchema(BaseModel):
    slug: Optional[str] = None
    name: str
    title: str
    subtitle: Optional[str] = None
    excerpt: str
    content: Optional[str] = None
    quote: Optional[str] = None
    quote_by: Optional[str] = None
    image_url: Optional[str] = None
    category: str = "Founder Story"
    date: str
    read_time: str = "5 min read"
    published: bool = True

class StartupStorySchema(BaseModel):
    slug: Optional[str] = None
    title: str
    subtitle: Optional[str] = None
    excerpt: str
    content: Optional[str] = None
    quote: Optional[str] = None
    quote_by: Optional[str] = None
    tag: str = "Ecosystem"
    date: str = "Coming soon"
    image_url: Optional[str] = None
    published: bool = True

class RealityEpisodeSchema(BaseModel):
    series_id: Optional[int] = None
    episode_number: int = 1
    title: str
    excerpt: str
    video_url: Optional[str] = None
    date: str = "Coming soon"
    published: bool = True

class RealitySeriesSchema(BaseModel):
    slug: Optional[str] = None
    title: str
    description: str
    tag: str = "Documentary"
    published: bool = True

class CorporateGirlieSchema(BaseModel):
    slug: Optional[str] = None
    title: str
    author: str = "Anonymous"
    excerpt: str
    summary: Optional[str] = None
    content: Optional[str] = None
    tag: str = "Corporate Culture"
    date: str
    image_url: Optional[str] = None
    substack_url: Optional[str] = None
    published: bool = True

class EventDocumentarySchema(BaseModel):
    title: str
    subtitle: Optional[str] = None
    author: Optional[str] = None
    body: str
    content: Optional[str] = None
    highlights: Optional[str] = None
    tag: str = "Summit"
    date: str
    location: Optional[str] = None
    video_url: Optional[str] = None
    published: bool = True

class AuthorNoteSchema(BaseModel):
    slug: Optional[str] = None
    title: str
    excerpt: str
    content: Optional[str] = None
    date: str
    published: bool = True

class HomeReaderItemSchema(BaseModel):
    tab_id: int = 0
    tag: str
    date: str
    title: str
    body: str
    source: Optional[str] = None
    label: Optional[str] = None
    sort_order: int = 0
    published: bool = True

class NewsletterRequest(BaseModel):
    subject: str
    body: str


# --- SUBSCRIBERS & REGISTRATIONS ---

@app.post("/api/register")
async def create_registration(registration: RegistrationCreate, db: Session = Depends(get_db)):
    db_registration = models.Registration(
        name=registration.name,
        email=registration.email,
        source=registration.source
    )
    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)
    await broadcast_change("registrations", "created", db_registration.id)
    return {"status": "success", "data": db_registration}

@app.get("/api/registrations")
def get_registrations(db: Session = Depends(get_db)):
    return db.query(models.Registration).all()


# --- ENTREPRENEUR LESSONS ---

@app.get("/api/lessons")
def get_lessons(published_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.EntrepreneurLesson)
    if published_only:
        query = query.filter(models.EntrepreneurLesson.published == True)
    return query.all()

@app.get("/api/lessons/by-slug/{slug}")
def get_lesson_by_slug(slug: str, db: Session = Depends(get_db)):
    item = db.query(models.EntrepreneurLesson).filter(models.EntrepreneurLesson.slug == slug).first()
    if not item:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return item

@app.post("/api/lessons")
async def create_lesson(item: LessonSchema, db: Session = Depends(get_db)):
    slug = item.slug or item.title.lower().replace(" ", "-").replace("?", "").replace("'", "")
    db_item = models.EntrepreneurLesson(**item.dict())
    db_item.slug = slug
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("lessons", "created", db_item.id)
    return db_item

@app.put("/api/lessons/{item_id}")
async def update_lesson(item_id: int, item: LessonSchema, db: Session = Depends(get_db)):
    db_item = db.query(models.EntrepreneurLesson).filter(models.EntrepreneurLesson.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Lesson not found")
    data = item.dict()
    for key, value in data.items():
        if key == "slug":
            if value:
                db_item.slug = value
            elif not db_item.slug and item.title:
                db_item.slug = slugify(item.title)
            continue
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("lessons", "updated", db_item.id)
    return db_item

@app.delete("/api/lessons/{item_id}")
async def delete_lesson(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.EntrepreneurLesson).filter(models.EntrepreneurLesson.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Lesson not found")
    db.delete(db_item)
    db.commit()
    await broadcast_change("lessons", "deleted", item_id)
    return {"status": "deleted"}


# --- STARTUP STORIES ---

@app.get("/api/startup-stories")
def get_startup_stories(published_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.StartupStory)
    if published_only:
        query = query.filter(models.StartupStory.published == True)
    return query.all()

@app.get("/api/startup-stories/{item_id}")
def get_startup_story_by_id(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.StartupStory).filter(models.StartupStory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Startup story not found")
    return item

@app.get("/api/startup-stories/by-slug/{slug}")
def get_startup_story_by_slug(slug: str, db: Session = Depends(get_db)):
    item = db.query(models.StartupStory).filter(models.StartupStory.slug == slug).first()
    if not item:
        raise HTTPException(status_code=404, detail="Startup story not found")
    return item

@app.post("/api/startup-stories")
async def create_startup_story(item: StartupStorySchema, db: Session = Depends(get_db)):
    slug = item.slug or slugify(item.title)
    db_item = models.StartupStory(**item.dict())
    db_item.slug = slug
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("startup_stories", "created", db_item.id)
    return db_item

@app.put("/api/startup-stories/{item_id}")
async def update_startup_story(item_id: int, item: StartupStorySchema, db: Session = Depends(get_db)):
    db_item = db.query(models.StartupStory).filter(models.StartupStory.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Story not found")
    data = item.dict()
    for key, value in data.items():
        if key == "slug":
            if value:
                db_item.slug = value
            elif not db_item.slug and item.title:
                db_item.slug = slugify(item.title)
            continue
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("startup_stories", "updated", db_item.id)
    return db_item


@app.delete("/api/startup-stories/{item_id}")
async def delete_startup_story(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.StartupStory).filter(models.StartupStory.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Story not found")
    db.delete(db_item)
    db.commit()
    await broadcast_change("startup_stories", "deleted", item_id)
    return {"status": "deleted"}


# --- REALITY OF STARTUPS (SERIES & EPISODES) ---

@app.get("/api/reality-series")
def get_reality_series(published_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.RealitySeries).options(joinedload(models.RealitySeries.episodes))
    if published_only:
        query = query.filter(models.RealitySeries.published == True)
    return query.all()

@app.post("/api/reality-series")
async def create_reality_series(item: RealitySeriesSchema, db: Session = Depends(get_db)):
    slug = item.slug or item.title.lower().replace(" ", "-").replace("?", "")
    db_item = models.RealitySeries(**item.dict())
    db_item.slug = slug
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("reality_series", "created", db_item.id)
    return db_item

@app.put("/api/reality-series/{series_id}")
async def update_reality_series(series_id: int, item: RealitySeriesSchema, db: Session = Depends(get_db)):
    db_item = db.query(models.RealitySeries).filter(models.RealitySeries.id == series_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Series not found")
    data = item.dict()
    for key, value in data.items():
        if key == "slug":
            if value:
                db_item.slug = value
            elif not db_item.slug and item.title:
                db_item.slug = slugify(item.title)
            continue
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("reality_series", "updated", db_item.id)
    return db_item

@app.delete("/api/reality-series/{series_id}")
async def delete_reality_series(series_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.RealitySeries).filter(models.RealitySeries.id == series_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Series not found")
    db.delete(db_item)
    db.commit()
    await broadcast_change("reality_series", "deleted", series_id)
    return {"status": "deleted"}

@app.post("/api/reality-series/{series_id}/episodes")
async def create_reality_episode(series_id: int, episode: RealityEpisodeSchema, db: Session = Depends(get_db)):
    db_episode = models.RealityEpisode(**episode.dict())
    db_episode.series_id = series_id
    db.add(db_episode)
    db.commit()
    db.refresh(db_episode)
    await broadcast_change("reality_series", "updated", series_id)
    return db_episode

@app.delete("/api/reality-episodes/{episode_id}")
async def delete_reality_episode(episode_id: int, db: Session = Depends(get_db)):
    db_episode = db.query(models.RealityEpisode).filter(models.RealityEpisode.id == episode_id).first()
    if not db_episode:
        raise HTTPException(status_code=404, detail="Episode not found")
    series_id = db_episode.series_id
    db.delete(db_episode)
    db.commit()
    await broadcast_change("reality_series", "updated", series_id)
    return {"status": "deleted"}


# --- CORPORATE GIRLIE ---

@app.get("/api/corporate-girlie")
def get_corporate_girlie(published_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.CorporateGirlie)
    if published_only:
        query = query.filter(models.CorporateGirlie.published == True)
    return query.all()

@app.post("/api/corporate-girlie")
async def create_corporate_girlie(item: CorporateGirlieSchema, db: Session = Depends(get_db)):
    slug = item.slug or slugify(item.title)
    db_item = models.CorporateGirlie(**item.dict())
    db_item.slug = slug
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("corporate_girlie", "created", db_item.id)
    return db_item

@app.put("/api/corporate-girlie/{item_id}")
async def update_corporate_girlie(item_id: int, item: CorporateGirlieSchema, db: Session = Depends(get_db)):
    db_item = db.query(models.CorporateGirlie).filter(models.CorporateGirlie.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Corporate Girlie post not found")
    data = item.dict()
    for key, value in data.items():
        if key == "slug":
            if value:
                db_item.slug = value
            elif not db_item.slug and item.title:
                db_item.slug = slugify(item.title)
            continue
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("corporate_girlie", "updated", db_item.id)
    return db_item

@app.delete("/api/corporate-girlie/{item_id}")
async def delete_corporate_girlie(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.CorporateGirlie).filter(models.CorporateGirlie.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Corporate Girlie post not found")
    db.delete(db_item)
    db.commit()
    await broadcast_change("corporate_girlie", "deleted", item_id)
    return {"status": "deleted"}


# --- EVENT DOCUMENTARIES ---

@app.get("/api/events")
def get_events(published_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.EventDocumentary)
    if published_only:
        query = query.filter(models.EventDocumentary.published == True)
    return query.all()

@app.post("/api/events")
async def create_event(item: EventDocumentarySchema, db: Session = Depends(get_db)):
    db_item = models.EventDocumentary(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("events", "created", db_item.id)
    return db_item

@app.put("/api/events/{item_id}")
async def update_event(item_id: int, item: EventDocumentarySchema, db: Session = Depends(get_db)):
    db_item = db.query(models.EventDocumentary).filter(models.EventDocumentary.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Event not found")
    data = item.dict()
    for key, value in data.items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("events", "updated", db_item.id)
    return db_item

@app.delete("/api/events/{item_id}")
async def delete_event(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.EventDocumentary).filter(models.EventDocumentary.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_item)
    db.commit()
    await broadcast_change("events", "deleted", item_id)
    return {"status": "deleted"}


# --- AUTHOR NOTES & ESSAYS ---

@app.get("/api/notes")
def get_notes(published_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.AuthorNote)
    if published_only:
        query = query.filter(models.AuthorNote.published == True)
    return query.all()

@app.get("/api/notes/by-slug/{slug}")
def get_note_by_slug(slug: str, db: Session = Depends(get_db)):
    item = db.query(models.AuthorNote).filter(models.AuthorNote.slug == slug).first()
    if not item:
        raise HTTPException(status_code=404, detail="Note not found")
    return item

@app.post("/api/notes")
async def create_note(item: AuthorNoteSchema, db: Session = Depends(get_db)):
    slug = item.slug or slugify(item.title)
    db_item = models.AuthorNote(**item.dict())
    db_item.slug = slug
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("notes", "created", db_item.id)
    return db_item

@app.put("/api/notes/{item_id}")
async def update_note(item_id: int, item: AuthorNoteSchema, db: Session = Depends(get_db)):
    db_item = db.query(models.AuthorNote).filter(models.AuthorNote.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Note not found")
    data = item.dict()
    for key, value in data.items():
        if key == "slug":
            if value:
                db_item.slug = value
            elif not db_item.slug and item.title:
                db_item.slug = slugify(item.title)
            continue
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("notes", "updated", db_item.id)
    return db_item

@app.delete("/api/notes/{item_id}")
async def delete_note(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.AuthorNote).filter(models.AuthorNote.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_item)
    db.commit()
    await broadcast_change("notes", "deleted", item_id)
    return {"status": "deleted"}


# --- HOMEPAGE LIVE READER ITEMS ---

@app.get("/api/home-reader")
def get_home_reader_items(published_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(models.HomeReaderItem).order_by(models.HomeReaderItem.sort_order.asc(), models.HomeReaderItem.id.asc())
    if published_only:
        query = query.filter(models.HomeReaderItem.published == True)
    return query.all()

@app.post("/api/home-reader")
async def create_home_reader_item(item: HomeReaderItemSchema, db: Session = Depends(get_db)):
    db_item = models.HomeReaderItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("home_reader", "created", db_item.id)
    return db_item

@app.put("/api/home-reader/{item_id}")
async def update_home_reader_item(item_id: int, item: HomeReaderItemSchema, db: Session = Depends(get_db)):
    db_item = db.query(models.HomeReaderItem).filter(models.HomeReaderItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Home reader item not found")
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    await broadcast_change("home_reader", "updated", db_item.id)
    return db_item

@app.delete("/api/home-reader/{item_id}")
async def delete_home_reader_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.HomeReaderItem).filter(models.HomeReaderItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Home reader item not found")
    db.delete(db_item)
    db.commit()
    await broadcast_change("home_reader", "deleted", item_id)
    return {"status": "deleted"}


# --- DATABASE SEED ENDPOINT ---

@app.post("/api/admin/seed")
async def seed_database(db: Session = Depends(get_db)):
    from seed_all import seed_all_data
    seed_all_data(db, force_refresh=True)
    await broadcast_change("all", "seeded")
    return {"status": "success", "message": "Database successfully seeded with comprehensive data for all sections!"}



# --- EMAIL & NEWSLETTER INTEGRATION ---

def send_email_to_subscribers(subject: str, body: str, db: Session):
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_port = int(os.environ.get("SMTP_PORT", 465))
    smtp_user = os.environ.get("SMTP_USER")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    from_email = os.environ.get("SMTP_FROM_EMAIL", smtp_user)
    
    if not smtp_host or not smtp_user or not smtp_password:
        raise HTTPException(status_code=500, detail="SMTP credentials not fully configured in .env")

    subscribers = db.query(models.Registration).filter(models.Registration.source == "subscribe").all()
    if not subscribers:
        return 0
    
    try:
        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
            
        server.login(smtp_user, smtp_password)
        
        count = 0
        for sub in subscribers:
            msg = EmailMessage()
            msg.set_content(body)
            msg['Subject'] = subject
            msg['From'] = from_email
            msg['To'] = sub.email
            server.send_message(msg)
            count += 1
            
        server.quit()
        return count
    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send emails. Error: {str(e)}")

@app.post("/api/admin/send-newsletter")
def send_newsletter(request: NewsletterRequest, db: Session = Depends(get_db)):
    count = send_email_to_subscribers(request.subject, request.body, db)
    return {"status": "success", "emails_sent": count}

class WordPressWebhook(BaseModel):
    post_title: str
    post_url: str

@app.post("/api/webhooks/wordpress")
def wordpress_webhook(webhook: WordPressWebhook, db: Session = Depends(get_db)):
    subject = f"New Blog Post: {webhook.post_title}"
    body = f"We just published a new blog post!\n\nRead it here: {webhook.post_url}\n\nThanks for subscribing to Verity Insights!"
    count = send_email_to_subscribers(subject, body, db)
    return {"status": "success", "emails_sent": count}
