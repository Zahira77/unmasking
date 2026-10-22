import os
import re
from urllib.parse import urlparse, unquote
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import pymysql

load_dotenv()

DEFAULT_MYSQL_URL = "mysql+pymysql://root:Verity2026@localhost:3306/unmasking_db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_MYSQL_URL)

def ensure_mysql_database(db_url: str):
    """
    If using MySQL, ensure the target database exists on the server.
    """
    try:
        # Strip dialect prefix e.g. mysql+pymysql:// -> http:// for parsing
        clean_url = re.sub(r"^mysql(\+pymysql)?://", "http://", db_url)
        parsed = urlparse(clean_url)
        db_name = parsed.path.lstrip("/")
        if not db_name:
            return

        user = unquote(parsed.username) if parsed.username else "root"
        password = unquote(parsed.password) if parsed.password else ""

        conn = pymysql.connect(
            host=parsed.hostname or "localhost",
            port=parsed.port or 3306,
            user=user,
            password=password,
            connect_timeout=5
        )
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        conn.commit()
        conn.close()
        print(f"[*] Verified MySQL database '{db_name}' exists.")
    except Exception as e:
        print(f"[!] Warning: Could not verify/create MySQL database via raw admin connection: {e}")

# Build engine — attempt MySQL first; fallback gracefully to SQLite if MySQL is not available
Base = declarative_base()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQLITE_FALLBACK = f"sqlite:///{os.path.join(BASE_DIR, 'verity.db').replace(os.sep, '/')}"

try:
    if DATABASE_URL.startswith("sqlite"):
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
        print(f"[*] Using SQLite database: {DATABASE_URL}")
    else:
        # Try ensuring MySQL database exists
        ensure_mysql_database(DATABASE_URL)
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=3600,
            pool_size=10,
            max_overflow=20,
        )
        # Test connection
        with engine.connect() as connection:
            pass
        print(f"[*] Successfully connected to MySQL database: {DATABASE_URL}")
except Exception as err:
    print(f"[!] MySQL not reachable ({err}). Falling back to local SQLite 'verity.db' for development.")
    engine = create_engine(SQLITE_FALLBACK, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


