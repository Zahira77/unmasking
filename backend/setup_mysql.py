"""
MySQL Database Setup Utility for Unmasking Backend.
Run this script to test your MySQL connection and initialize 'unmasking_db'.
Usage:
    python setup_mysql.py
"""

import os
import pymysql
from dotenv import load_dotenv

load_dotenv()

def main():
    print("=" * 60)
    print("  UNMASKING PLATFORM - MYSQL SETUP UTILITY")
    print("=" * 60)

    host = input("MySQL Host [localhost]: ").strip() or "localhost"
    port_input = input("MySQL Port [3306]: ").strip() or "3306"
    port = int(port_input)
    user = input("MySQL Username [root]: ").strip() or "root"
    password = input("MySQL Password: ")
    dbname = input("Database Name [unmasking_db]: ").strip() or "unmasking_db"

    print(f"\nAttempting connection to MySQL server at {host}:{port} as user '{user}'...")
    try:
        conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            connect_timeout=5
        )
        print(" Connected to MySQL server successfully!")

        with conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print(f" Database '{dbname}' verified/created.")

        conn.commit()
        conn.close()

        # Update or verify .env
        env_path = os.path.join(os.path.dirname(__file__), ".env")
        new_db_url = f"mysql+pymysql://{user}:{password}@{host}:{port}/{dbname}"

        print(f"\nRecommended DATABASE_URL:\n{new_db_url}\n")
        update_env = input("Update .env with this connection string? (y/n) [y]: ").strip().lower() != "n"
        if update_env:
            lines = []
            if os.path.exists(env_path):
                with open(env_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
            
            updated = False
            for idx, line in enumerate(lines):
                if line.startswith("DATABASE_URL="):
                    lines[idx] = f"DATABASE_URL={new_db_url}\n"
                    updated = True
                    break
            if not updated:
                lines.insert(0, f"DATABASE_URL={new_db_url}\n")

            with open(env_path, "w", encoding="utf-8") as f:
                f.writelines(lines)
            print(f" .env updated successfully at {env_path}")

        print("\nNext step: Start or restart your FastAPI server:")
        print("  python -m uvicorn main:app --reload --port 8000")
        print("=" * 60)

    except Exception as e:
        print(f"\n Connection failed: {e}")
        print("\nPlease check that:")
        print("1. Your MySQL Server is running (e.g. via Windows Services, XAMPP, Laragon, or MySQL Command Line).")
        print("2. The port (default 3306), username, and password are correct.")
        print("3. In the meantime, the FastAPI server will automatically fall back to SQLite (verity.db) without crashing.")

if __name__ == "__main__":
    main()
