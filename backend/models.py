from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), index=True)
    source = Column(String(255), default="subscribe") # 'subscribe' or 'book'

class EntrepreneurLesson(Base):
    __tablename__ = "entrepreneur_lessons"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True)
    name = Column(String(255))
    title = Column(String(255))
    subtitle = Column(String(500), nullable=True)
    excerpt = Column(Text)
    content = Column(Text, nullable=True)
    quote = Column(Text, nullable=True)
    quote_by = Column(String(255), nullable=True)
    image_url = Column(String(500), nullable=True)
    category = Column(String(255), default="Founder Story")
    date = Column(String(255))
    read_time = Column(String(255), default="5 min read")
    published = Column(Boolean, default=True)

class StartupStory(Base):
    __tablename__ = "startup_stories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True)
    title = Column(String(255))
    subtitle = Column(String(500), nullable=True)
    excerpt = Column(Text)
    content = Column(Text, nullable=True)
    quote = Column(Text, nullable=True)
    quote_by = Column(String(255), nullable=True)
    tag = Column(String(255), default="Ecosystem")
    date = Column(String(255), default="Coming soon")
    image_url = Column(String(500), nullable=True)
    published = Column(Boolean, default=True)

class RealitySeries(Base):
    __tablename__ = "reality_series"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    tag = Column(String(255), default="Documentary")
    published = Column(Boolean, default=True)

    episodes = relationship("RealityEpisode", back_populates="series", cascade="all, delete-orphan")

class RealityEpisode(Base):
    __tablename__ = "reality_episodes"

    id = Column(Integer, primary_key=True, index=True)
    series_id = Column(Integer, ForeignKey("reality_series.id"))
    episode_number = Column(Integer, default=1)
    title = Column(String(255))
    excerpt = Column(Text)
    video_url = Column(String(500), nullable=True)
    date = Column(String(255), default="Coming soon")
    published = Column(Boolean, default=True)

    series = relationship("RealitySeries", back_populates="episodes")

class CorporateGirlie(Base):
    __tablename__ = "corporate_girlie"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True)
    title = Column(String(255))
    author = Column(String(255), default="Anonymous")
    excerpt = Column(Text)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    tag = Column(String(255), default="Corporate Culture")
    date = Column(String(255))
    image_url = Column(String(500), nullable=True)
    substack_url = Column(String(500), nullable=True)
    published = Column(Boolean, default=True)

class EventDocumentary(Base):
    __tablename__ = "event_documentaries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    subtitle = Column(String(500), nullable=True)
    author = Column(String(255), nullable=True)
    body = Column(Text)
    content = Column(Text, nullable=True)
    highlights = Column(Text, nullable=True)
    tag = Column(String(255), default="Summit")
    date = Column(String(255))
    location = Column(String(255), nullable=True)
    video_url = Column(String(500), nullable=True)
    published = Column(Boolean, default=True)

class AuthorNote(Base):
    __tablename__ = "author_notes"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True)
    title = Column(String(255))
    excerpt = Column(Text)
    content = Column(Text, nullable=True)
    date = Column(String(255))
    published = Column(Boolean, default=True)

class HomeReaderItem(Base):
    __tablename__ = "home_reader_items"

    id = Column(Integer, primary_key=True, index=True)
    tab_id = Column(Integer, default=0) # 0: Startup News, 1: Fact, 2: Update
    tag = Column(String(255))
    date = Column(String(255))
    title = Column(String(255))
    body = Column(Text)
    source = Column(String(255), nullable=True)
    label = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)
    published = Column(Boolean, default=True)



