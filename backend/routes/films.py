from flask import Blueprint, jsonify
from db import get_db

films_bp = Blueprint('films', __name__, url_prefix='/api/films')


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

@films_bp.route("/<int:film_id>")
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

#find movie to rent and create a record for it 
from flask import request
from datetime import datetime

@films_bp.route("/<int:film_id>/rent", methods=["POST"])
def rent_film(film_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    data = request.json

    #validation of the actual request body
    if not data or "customer_id" not in data:
        return jsonify({"error": "customer_id is required"}), 400

    customer_id = data.get("customer_id")

    #verify that the customer exists
    cursor.execute("""
        SELECT customer_id
        FROM customer
        WHERE customer_id = %s
    """, (customer_id,))

    customer = cursor.fetchone()

    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    #find the available inventory 
    cursor.execute("""
        SELECT i.inventory_id
        FROM inventory i
        LEFT JOIN rental r 
            ON i.inventory_id = r.inventory_id
            AND r.return_date IS NULL
        WHERE i.film_id = %s
        AND r.rental_id IS NULL
        LIMIT 1
    """, (film_id,))

    inventory = cursor.fetchone()

    if not inventory:
        return jsonify({"error": "No available copies"}), 400

    inventory_id = inventory["inventory_id"]

    #create the record
    cursor.execute("""
        INSERT INTO rental
        (rental_date, inventory_id, customer_id, staff_id)
        VALUES (%s, %s, %s, %s)
    """, (datetime.now(), inventory_id, customer_id, 1))

    db.commit()

    cursor.close()
    db.close()

    return jsonify({
        "message": "Film rented successfully",
        "inventory_id": inventory_id
    }), 201
