from flask import Blueprint, jsonify
from db import get_db

films_bp = Blueprint("films", __name__, url_prefix="/api")

@films_bp.route("/top-films")
def top_films():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT f.film_id, f.title, COUNT(DISTINCT r.rental_id) AS rentals
        FROM film f
        JOIN inventory i ON f.film_id = i.film_id
        JOIN rental r ON i.inventory_id = r.inventory_id
        GROUP BY f.film_id, f.title
        ORDER BY rentals DESC
        LIMIT 5
    """)
    films = cursor.fetchall()
    cursor.close()
    return jsonify(films)

@films_bp.route("/films/<int:film_id>")
def film_details(film_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT film_id, title, description, release_year, rental_rate, length
        FROM film
        WHERE film_id = %s
    """, (film_id,))
    film = cursor.fetchone()
    cursor.close()
    
    if not film:
        return jsonify({"error": "Film not found"}), 404
        
    return jsonify(film)