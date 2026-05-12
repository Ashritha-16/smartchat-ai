
# Flask imports
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, flash

# Login system imports
from flask_login import login_user, logout_user, login_required, current_user

# Password security
from werkzeug.security import generate_password_hash, check_password_hash

# Project imports
from models import User, Chat
from extensions import db

# Gemini AI
from google import genai
import os

# Create blueprint
bp = Blueprint("main", __name__)

# Gemini AI setup
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# =========================
# WELCOME PAGE
# =========================
@bp.route("/")
def welcome():
    return render_template("welcome.html")


# =========================
# HOME PAGE (CHAT UI)
# =========================
@bp.route("/home")
@login_required
def home():
    return render_template("index.html", chats=[])


# =========================
# REGISTER
# =========================
@bp.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")
        confirm = request.form.get("confirm")

        # =====================
        # USERNAME VALIDATION
        # =====================

        if not username:
            flash("Username cannot be empty ❌")
            return redirect(url_for("main.register"))

        username = username.strip()

        if " " in username:
            flash("Username should not contain spaces ❌")
            return redirect(url_for("main.register"))

        if len(username) < 5:
            flash("Username must be at least 5 characters ❌")
            return redirect(url_for("main.register"))

        # =====================
        # PASSWORD MATCH CHECK
        # =====================

        if password != confirm:
            flash("Passwords do not match ❌")
            return redirect(url_for("main.register"))

        # =====================
        # PASSWORD VALIDATION
        # =====================

        if len(password) < 5:
            flash("Password must be at least 5 characters ❌")
            return redirect(url_for("main.register"))

        if not any(c.isupper() for c in password):
            flash("Password must contain 1 uppercase letter ❌")
            return redirect(url_for("main.register"))

        if not any(c.islower() for c in password):
            flash("Password must contain 1 lowercase letter ❌")
            return redirect(url_for("main.register"))

        if not any(c.isdigit() for c in password):
            flash("Password must contain 1 number ❌")
            return redirect(url_for("main.register"))

        if not any(c in "@#$%^&*!" for c in password):
            flash("Password must contain 1 special character ❌")
            return redirect(url_for("main.register"))

        # =====================
        # EXISTING USER CHECK
        # =====================

        if User.query.filter_by(username=username).first():
            flash("Username already exists ❌")
            return redirect(url_for("main.register"))

        # =====================
        # CREATE USER
        # =====================

        new_user = User(
            username=username,
            password=generate_password_hash(password)
        )

        db.session.add(new_user)
        db.session.commit()

        flash("Registered successfully ✅ Please login")
        return redirect(url_for("main.login"))

    return render_template("register.html")

# =========================
# LOGIN
# =========================
@bp.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for("main.home"))

        flash("Invalid username or password ❌")
        return redirect(url_for("main.login"))

    return render_template("login.html")


# =========================
# LOGOUT
# =========================
@bp.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("main.login"))


# =========================
# CHAT API
# =========================
@bp.route("/chat", methods=["POST"])
@login_required
def chat():

    user_input = request.json.get("message")

    if not user_input:
        return jsonify({"response": "Please type a message"})

    if len(user_input) > 1000:
        return jsonify({"response": "Message too long"})

    # Get last 5 chats for memory
    previous_chats = Chat.query.filter_by(
        user_id=current_user.id
    ).order_by(Chat.id.desc()).limit(5).all()

    previous_chats.reverse()

    memory = ""
    for chat_item in previous_chats:
        memory += f"User: {chat_item.user_message}\nBot: {chat_item.bot_response}\n"

    # Prompt for AI
    prompt = f"""
You are SmartChat-AI, a friendly conversational AI chatbot.

RULES:
- If user greets (hello/hi/hey), reply: "Hi 👋 How can I help you?"

Chat History:
{memory}

User:
{user_input}
"""

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )

        bot_reply = response.text

        # Save chat
        new_chat = Chat(
            user_id=current_user.id,
            user_message=user_input,
            bot_response=bot_reply
        )

        db.session.add(new_chat)
        db.session.commit()

        return jsonify({"response": bot_reply})

    except Exception as error:
        return jsonify({"response": str(error)})


# =========================
# CHAT HISTORY
# =========================
@bp.route("/history")
@login_required
def history():

    chats = Chat.query.filter_by(
        user_id=current_user.id
    ).order_by(Chat.id.desc()).all()

    return jsonify([
        {
            "id": chat.id,
            "message": chat.user_message,
            "response": chat.bot_response
        }
        for chat in chats
    ])


# =========================
# OPEN SINGLE CHAT
# =========================
@bp.route("/open_chat/<int:chat_id>")
@login_required
def open_chat(chat_id):

    chat = Chat.query.filter_by(
        id=chat_id,
        user_id=current_user.id
    ).first()

    if not chat:
        return jsonify({"message": "Chat not found"})

    return jsonify({
        "user_message": chat.user_message,
        "bot_response": chat.bot_response
    })


# =========================
# DELETE CHAT
# =========================
@bp.route("/delete_chat/<int:chat_id>", methods=["POST"])
@login_required
def delete_chat(chat_id):

    chat = Chat.query.filter_by(
        id=chat_id,
        user_id=current_user.id
    ).first()

    if not chat:
        return jsonify({"message": "Chat not found"})

    db.session.delete(chat)
    db.session.commit()

    return jsonify({"message": "Chat deleted"})