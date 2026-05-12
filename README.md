# smartchat-ai Web App

A Flask-based AI chatbot using Google Gemini API.

## Features
- Login/Register system
- AI chatbot
- Chat history
- Voice input
- Dark mode

## Tech Stack
- Python
- Flask
- MySQL
- HTML/CSS/JavaScript
- Gemini API

## Database Setup

CREATE DATABASE chatbot_db;

USE chatbot_db;

## Create .env File

SECRET_KEY=your_secret_key

DATABASE_URL=mysql+pymysql://root:yourpassword@localhost/chatbot_db

GEMINI_API_KEY=your_gemini_api_key

## How to run

1. Install requirements:
   pip install -r requirements.txt

2. Run app:
   python app.py

3. Open:
   http://127.0.0.1:5000/