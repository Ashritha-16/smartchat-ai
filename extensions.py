# Initialize database and login manager
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()

# Redirect users to login page if not authenticated
login_manager.login_view = "main.login"