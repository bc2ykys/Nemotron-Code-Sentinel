"""
DEMO 1 — Paste this for SECURITY SCAN mode
Shows: SQL Injection, Hardcoded credentials, Command Injection, Path Traversal
"""

import sqlite3
import os
import hashlib

# Hardcoded credentials — CWE-798
DB_PASS = "admin123"
SECRET_KEY = "supersecret_do_not_share"

def login(username, password):
    """Authenticate user against the database."""
    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()

    # SQL Injection — CWE-89
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor.execute(query)
    user = cursor.fetchone()
    conn.close()
    return user

def read_file(filename):
    """Read a user-provided file — Path Traversal — CWE-22"""
    base_dir = "/var/app/uploads/"
    path = base_dir + filename          # attacker can pass ../../etc/passwd
    with open(path, "r") as f:
        return f.read()

def run_report(report_name):
    """Generate report — Command Injection — CWE-78"""
    os.system(f"python reports/{report_name}.py")   # shell=True equivalent

def hash_password(password):
    """Store password — Weak Hashing — CWE-327"""
    return hashlib.md5(password.encode()).hexdigest()   # MD5 is broken

def get_user_data(user_id):
    conn = sqlite3.connect("app.db")
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id=" + str(user_id))  # Second SQLi
    return cur.fetchall()
    # Bug: connection never closed — resource leak
