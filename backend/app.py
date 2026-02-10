from flask import Flask
from flask_cors import CORS

from routes.films import films_bp
from routes.actors import actors_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(films_bp)
app.register_blueprint(actors_bp)

if __name__ == "__main__":
    app.run(debug=True)
