from flask import Blueprint, jsonify
from db import get_db

actors_bp = Blueprint("actors", __name__, url_prefix="/api")

@actors_bp.route("/top-actors")
def top_actors():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT a.actor_id, a.first_name, a.last_name, COUNT(r.rental_id) AS rentals
        FROM rental r
        JOIN inventory i ON r.inventory_id = i.inventory_id
        JOIN film_actor fa ON i.film_id = fa.film_id
        JOIN actor a ON fa.actor_id = a.actor_id
        GROUP BY a.actor_id
        ORDER BY rentals DESC
        LIMIT 5
    """)
    actors = cursor.fetchall()
    cursor.close()
    return jsonify(actors)

@actors_bp.route("/actors/<int:actor_id>")
def actor_details(actor_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT actor_id, first_name, last_name
        FROM actor
        WHERE actor_id = %s
    """, (actor_id,))
    actor = cursor.fetchone()

    if not actor:
        cursor.close()
        return jsonify({"error": "Actor not found"}), 404

    cursor.execute("""
    SELECT 
        f.film_id, 
        f.title, 
        COUNT(r.rental_id) AS rentals
    FROM film f
    JOIN film_actor fa ON f.film_id = fa.film_id
    JOIN inventory i ON f.film_id = i.film_id
    JOIN rental r ON i.inventory_id = r.inventory_id
    WHERE fa.actor_id = %s
    GROUP BY f.film_id, f.title
    ORDER BY rentals DESC
    LIMIT 5
""", (actor_id,))
    
    top_films = cursor.fetchall()
    cursor.close()

    return jsonify({
        "actor_info": actor,
        "top_rented_films": top_films
    })