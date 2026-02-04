import sqlite3
import json
import os
from pathlib import Path

DB_PATH = Path(__file__).parent / "amazon_clone.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Categories table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT NOT NULL,
        link TEXT NOT NULL
    )
    ''')
    
    # Products table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        price REAL NOT NULL,
        originalPrice REAL NOT NULL,
        rating REAL NOT NULL,
        reviewCount INTEGER NOT NULL,
        image TEXT NOT NULL,
        isPrime BOOLEAN NOT NULL,
        category TEXT NOT NULL,
        inStock BOOLEAN NOT NULL,
        brand TEXT,
        about TEXT, -- JSON string
        specs TEXT, -- JSON string
        offers TEXT  -- JSON string
    )
    ''')
    
    # Hero Slides table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS hero_slides (
        id INTEGER PRIMARY KEY,
        image TEXT NOT NULL,
        title TEXT NOT NULL,
        link TEXT NOT NULL,
        backgroundColor TEXT NOT NULL
    )
    ''')
    
    # Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        is_prime BOOLEAN DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Orders table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_number TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        subtotal REAL NOT NULL,
        tax REAL DEFAULT 0.00,
        shipping_fee REAL DEFAULT 0.00,
        discount REAL DEFAULT 0.00,
        total REAL NOT NULL,
        shipping_address TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        delivered_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    ''')
    
    # Order Items table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        product_snapshot TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
    ''')
    
    conn.commit()
    conn.close()
