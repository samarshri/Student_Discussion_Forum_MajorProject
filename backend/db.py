"""
Database connection utilities for SQLite
Uses sqlite3 for local storage
"""

import os
import sqlite3
print("📂 Loading db.py...")
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

# Fixed SQLite database name
DB_NAME = 'forum.db'

def init_db():
    """Initialize SQLite database with schema or apply migrations"""
    db_exists = os.path.exists(DB_NAME)
    
    conn = sqlite3.connect(DB_NAME)
    try:
        if not db_exists:
            print("Initializing new SQLite database...")
            script_path = os.path.join(os.path.dirname(__file__), 'schema_sqlite.sql')
            if os.path.exists(script_path):
                with open(script_path, 'r') as f:
                    conn.executescript(f.read())
                print("✅ Schema applied.")
            else:
                print("⚠️ schema_sqlite.sql not found!")
        else:
            # Migration: rename follows to user_follows if needed
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='follows'")
            if cursor.fetchone():
                print("Running migration: Renaming 'follows' to 'user_follows'...")
                cursor.execute("ALTER TABLE follows RENAME TO user_follows")
                conn.commit()
                print("✅ Migration complete.")
        
        cursor = conn.cursor()
        
        # Migration: fix column name followed_id -> following_id
        cursor.execute("PRAGMA table_info(user_follows)")
        columns = [info[1] for info in cursor.fetchall()]
        if 'followed_id' in columns and 'following_id' not in columns:
            print("Running migration: Renaming 'followed_id' to 'following_id'...")
            try:
                cursor.execute("ALTER TABLE user_follows RENAME COLUMN followed_id TO following_id")
                conn.commit()
                print("✅ Column migration complete.")
            except Exception as e:
                print(f"⚠️ Migration warning: {e}")
        
        # Migration: Add missing columns to conversations
        cursor.execute("PRAGMA table_info(conversations)")
        columns = [info[1] for info in cursor.fetchall()]
        if 'type' not in columns:
            print("Running migration: Adding 'type' to conversations...")
            try:
                cursor.execute("ALTER TABLE conversations ADD COLUMN type VARCHAR(20) DEFAULT 'direct'")
                conn.commit()
            except Exception as e:
                print(f"⚠️ Migration warning: {e}")
        
        if 'name' not in columns:
            print("Running migration: Adding 'name' to conversations...")
            try:
                cursor.execute("ALTER TABLE conversations ADD COLUMN name VARCHAR(100)")
                conn.commit()
            except Exception as e:
                print(f"⚠️ Migration warning: {e}")

        if 'updated_at' not in columns:
             print("Running migration: Adding 'updated_at' to conversations...")
             try:
                 cursor.execute("ALTER TABLE conversations ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP")
                 # Try to copy last_message_at if it exists
                 if 'last_message_at' in columns:
                     cursor.execute("UPDATE conversations SET updated_at = last_message_at")
                 conn.commit()
             except Exception as e:
                 print(f"⚠️ Migration warning: {e}")

        # Migration: Add missing columns to messages
        cursor.execute("PRAGMA table_info(messages)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'edited_at' not in columns:
            print("Running migration: Adding 'edited_at' to messages...")
            try:
                cursor.execute("ALTER TABLE messages ADD COLUMN edited_at DATETIME")
                conn.commit()
            except Exception as e:
                print(f"⚠️ Migration warning: {e}")

        if 'message_type' not in columns:
            print("Running migration: Adding 'message_type' to messages...")
            try:
                cursor.execute("ALTER TABLE messages ADD COLUMN message_type VARCHAR(20) DEFAULT 'text'")
                conn.commit()
            except Exception as e:
                print(f"⚠️ Migration warning: {e}")

        if 'attachment_url' not in columns:
            print("Running migration: Adding 'attachment_url' to messages...")
            try:
                cursor.execute("ALTER TABLE messages ADD COLUMN attachment_url VARCHAR(255)")
                conn.commit()
            except Exception as e:
                print(f"⚠️ Migration warning: {e}")
        
        if 'created_at' not in columns and 'timestamp' in columns:
             print("Running migration: Renaming 'timestamp' to 'created_at' in messages...")
             try:
                cursor.execute("ALTER TABLE messages RENAME COLUMN timestamp TO created_at")
                conn.commit()
             except Exception as e:
                print(f"⚠️ Migration warning: {e}")

        print("✅ Database state verified.")
    except Exception as e:
        print(f"❌ Database initialization/migration error: {e}")
    finally:
        conn.close()

# Initialize on import
init_db()

@contextmanager
def get_db_connection():
    """Context manager for SQLite database connections"""
    # Enable datetime parsing
    conn = sqlite3.connect(
        DB_NAME, 
        check_same_thread=False,
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    )
    
    # Helper for dict rows
    def dict_factory(cursor, row):
        d = {}
        for idx, col in enumerate(cursor.description):
            d[col[0]] = row[idx]
        return d
    
    conn.row_factory = dict_factory
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"❌ Database error: {e}")
        raise e
    finally:
        conn.close()


def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    """
    Execute a query and optionally fetch results
    Converts MySQL syntax (%s) to SQLite syntax (?)
    """
    params = params or ()
    
    # Convert MySQL syntax
    query = query.replace('%s', '?')
    print(f"🛠️ Executing: {query} with {params}")
    
    # Handle MySQL specific INSERT IGNORE -> INSERT OR IGNORE for SQLite
    if "INSERT IGNORE" in query.upper():
        query = query.replace("INSERT IGNORE", "INSERT OR IGNORE")
        query = query.replace("insert ignore", "insert or ignore")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            
            if fetch_one:
                return cursor.fetchone()
            elif fetch_all:
                return cursor.fetchall()
            else:
                # For INSERT, return last inserted ID
                if query.strip().upper().startswith('INSERT'):
                    return cursor.lastrowid
                # For UPDATE/DELETE, return rowcount
                return cursor.rowcount
        except Exception as e:
            print(f"❌ SQL Error: {e}")
            print(f"   Query: {query}")
            print(f"   Params: {params}")
            raise e
        finally:
            cursor.close()


def fetch_one(query, params=None):
    return execute_query(query, params, fetch_one=True)

def fetch_all(query, params=None):
    return execute_query(query, params, fetch_all=True)

def insert(query, params=None):
    return execute_query(query, params)

def update(query, params=None):
    return execute_query(query, params)

def delete(query, params=None):
    return execute_query(query, params)
