from flask import Flask
#from flask_cors import CORS
from films.routes import films_bp

app = Flask(__name__)
#CORS(app)
app.register_blueprint(films_bp) #make routes visible

@app.route("/api/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True)