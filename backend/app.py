from flask import Flask
from flask_cors import CORS
from routes.film_search import film_search_bp
#from routes.film_details import film_details_bp
from routes.films import films_bp
from routes.actors import actors_bp
from routes.customers import customers_bp


app = Flask(__name__)
CORS(app)
app.register_blueprint(film_search_bp) #make routes visible
#app.register_blueprint(film_details_bp)

app.register_blueprint(films_bp)
app.register_blueprint(actors_bp)
app.register_blueprint(customers_bp)

if __name__ == "__main__":
    app.run(debug=True)
