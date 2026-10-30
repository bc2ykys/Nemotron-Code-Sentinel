import sqlite3

def get_user(username, password):
    """Login function - find user by credentials"""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Build query with user input (VULNERABLE: SQL Injection)
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor.execute(query)
    
    user = cursor.fetchone()
    conn.close()
    return user

def update_profile(user_id, data):
    """Update user profile from form data"""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    for key, value in data.items():
        query = f"UPDATE users SET {key}='{value}' WHERE id={user_id}"
        cursor.execute(query)
    
    conn.commit()
    conn.close()

# API endpoint handler
def handle_login(request):
    username = request.form['username']
    password = request.form['password']  # Stored as plaintext
    
    user = get_user(username, password)
    if user:
        return {"status": "ok", "token": username + ":" + password}  # Token = credentials
    return {"status": "fail"}
