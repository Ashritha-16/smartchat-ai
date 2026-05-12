# Flask app setup
from flask import Flask
import config

from extensions import db, login_manager
from routes import bp
from models import User

# Create Flask app
app = Flask(__name__)

# Load configuration
app.config.from_object(config.Config)

# Initialize database and login manager
db.init_app(app)
login_manager.init_app(app)

# Load user for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register routes blueprint
app.register_blueprint(bp)

# Run application
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)