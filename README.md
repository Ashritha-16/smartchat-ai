# 🤖 SmartChat AI Web App

SmartChat AI is a Flask-based AI chatbot web application powered by the Google Gemini API. It provides real-time AI conversations with secure user authentication, chat history management, voice input support, and a modern responsive interface.

---

## 🌐 Live Demo

**Website:**
https://smartchat-ai-r3qu.onrender.com/

---

## 🚀 Features

* 🔐 User Registration & Login System
* 🤖 AI Chatbot powered by Google Gemini API
* 💬 Chat History Management
* 🎤 Voice Input Support
* 🌙 Dark Mode Interface
* 📱 Fully Responsive Design
* ⚡ Fast and User-Friendly Experience

---

## 🛠️ Tech Stack

### Backend

* Python
* Flask
* MySQL
* SQLAlchemy

### Frontend

* HTML5
* CSS3
* JavaScript

### AI Integration

* Google Gemini API

---

## ⚠️ API Usage Notice

This project uses the Google Gemini API under the free-tier plan. Due to API rate limits, users may occasionally encounter errors such as:

* 429 (Quota Exceeded)
* 503 (Service Unavailable)

These issues are temporary and depend on API availability and usage limits.

---

## 📂 Project Structure

```bash
smartchat-ai/
│
├── static/
├── templates/
├── app.py
├── requirements.txt
├── .env
└── README.md
```

---

## ⚙️ Database Setup

Create a MySQL database:

```sql
CREATE DATABASE chatbot_db;

USE chatbot_db;
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root directory:

```env
SECRET_KEY=your_secret_key

DATABASE_URL=mysql+pymysql://root:yourpassword@localhost/chatbot_db

GEMINI_API_KEY=your_gemini_api_key
```

---

## ▶️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ashritha-16/smartchat-ai.git
cd smartchat-ai
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create and update the `.env` file with your database credentials and Gemini API key.

### 4. Run the Application

```bash
python app.py
```

### 5. Open in Browser

```bash
http://127.0.0.1:5000/
```

---

## 🎯 Learning Outcomes

This project helped enhance skills in:

* Flask Web Development
* REST API Integration
* Authentication & Authorization
* Database Management with MySQL
* AI Chatbot Development
* Frontend & Backend Integration
* Responsive Web Design

---

## 👩‍💻 Author

**Ashritha**

GitHub:
https://github.com/ashritha-16

Live Project:
https://smartchat-ai-r3qu.onrender.com/

---

## ⭐ Support

If you found this project useful, please consider giving it a **Star ⭐** on GitHub.

Your support is greatly appreciated!
