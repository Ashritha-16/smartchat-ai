# Import database and Flask-Login support
from extensions import db
from flask_login import UserMixin

# User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    # One user can have multiple chats
    chats = db.relationship("Chat", backref="user", lazy=True)


# Chat model
class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # Foreign key linking chat to user
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    user_message = db.Column(db.Text)
    bot_response = db.Column(db.Text)
