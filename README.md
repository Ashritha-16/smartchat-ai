# 🤖 SmartChat AI Web App

A Flask-based AI chatbot web application powered by the Google Gemini API.
The application provides real-time AI conversations with authentication, chat history, voice input, and dark mode support.

---

# 🚀 Features

* 🔐 User Login & Registration System
* 🤖 AI Chatbot using Google Gemini API
* 💬 Chat History Management
* 🎤 Voice Input Support
* 🌙 Dark Mode UI
* 📱 Responsive Design

---

# 🛠️ Tech Stack

* Python
* Flask
* MySQL
* HTML5
* CSS3
* JavaScript
* Google Gemini API

---

# 📂 Project Structure

```bash id="7fpg9v"
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

# ⚙️ Database Setup

Create a MySQL database:

```sql id="ejbwj8"
CREATE DATABASE chatbot_db;

USE chatbot_db;
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root directory and add the following:

```env id="zr4n0t"
SECRET_KEY=your_secret_key

DATABASE_URL=mysql+pymysql://root:yourpassword@localhost/chatbot_db

GEMINI_API_KEY=your_gemini_api_key
```

---

# ▶️ How to Run the Project

## 1️⃣ Install Dependencies

```bash id="wtphkg"
pip install -r requirements.txt
```

## 2️⃣ Run the Flask Application

```bash id="0jvjlwm"
python app.py
```

## 3️⃣ Open in Browser

```bash id="lq6sv2"
http://127.0.0.1:5000/
```

---

# 🎯 Learning Outcomes

This project helped improve my understanding of:

* Flask Web Development
* REST API Integration
* Authentication Systems
* Database Management with MySQL
* AI Chatbot Integration
* Frontend & Backend Integration

---

# 👩‍💻 Author

**Ashritha**

🔗 GitHub:
https://github.com/ashritha-16

---

# ⭐ Support

If you like this project, please give it a star ⭐
