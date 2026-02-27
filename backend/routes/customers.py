from flask import Blueprint, request, jsonify
from db import get_db

customers_bp = Blueprint('customers', __name__, url_prefix='/api/customers')
# separate blueprint for rental-related endpoints (no customer prefix)
rentals_bp = Blueprint('rentals', __name__, url_prefix='/api/rentals')

def fetch_customers_logic(query_param, page, limit):
    offset = (page - 1) * limit
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    search_id = query_param if query_param.isdigit() else -1
    
    sql = """
        SELECT customer_id, first_name, last_name, email, active
        FROM customer
        WHERE (first_name LIKE %s OR last_name LIKE %s OR customer_id = %s)
        ORDER BY customer_id DESC
        LIMIT %s OFFSET %s
    """
    cursor.execute(sql, (f"%{query_param}%", f"%{query_param}%", search_id, limit, offset))
    customers = cursor.fetchall()
    cursor.close()
    return customers

@customers_bp.route("/", methods=["GET"])
def get_customers():
    query = request.args.get("query", "")
    page = int(request.args.get("page", 1))
    return jsonify(fetch_customers_logic(query, page, 10))

@customers_bp.route("/search", methods=["GET"])
def search_customers():
    query = request.args.get("query", "")
    return jsonify(fetch_customers_logic(query, 1, 10))

@customers_bp.route("/", methods=["POST"])
def add_customer():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    
    sql = """
        INSERT INTO customer (store_id, first_name, last_name, email, address_id, create_date, active)
        VALUES (%s, %s, %s, %s, %s, NOW(), 1)
    """
    try:
        cursor.execute(sql, (1, data['first_name'], data['last_name'], data['email'], 1))
        db.commit()
        return jsonify({"message": "Success", "id": cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()

@customers_bp.route("/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "DELETE FROM customer WHERE customer_id = %s"
        cursor.execute(sql, (customer_id,))
        db.commit()
        return jsonify({"message": "Customer deleted"}), 200
    except Exception as e:
        return jsonify({"error": "Could not delete customer. They likely have rental history."}), 400
    finally:
        cursor.close()

@customers_bp.route("/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):
    data = request.json
    db = get_db()
    cursor = db.cursor()

    sql = """
        UPDATE customer
        SET first_name=%s,
            last_name=%s,
            email=%s,
            active=%s
        WHERE customer_id=%s
    """

    try:
        cursor.execute(sql, (
            data["first_name"],
            data["last_name"],
            data["email"],
            data.get("active", 1),
            customer_id
        ))
        db.commit()
        return jsonify({"message": "Customer updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()

@customers_bp.route("/<int:customer_id>/details", methods=["GET"])
def customer_details(customer_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    # customer info
    cursor.execute("""
        SELECT customer_id, first_name, last_name, email, active
        FROM customer
        WHERE customer_id = %s
    """, (customer_id,))
    customer = cursor.fetchone()

    # rental history
    cursor.execute("""
        SELECT r.rental_id,
               f.title,
               r.rental_date,
               r.return_date
        FROM rental r
        JOIN inventory i ON r.inventory_id = i.inventory_id
        JOIN film f ON i.film_id = f.film_id
        WHERE r.customer_id = %s
        ORDER BY r.rental_date DESC
    """, (customer_id,))

    rentals = cursor.fetchall()

    cursor.close()

    return jsonify({
        "customer": customer,
        "rentals": rentals
    })

@rentals_bp.route("/<int:rental_id>/return", methods=["PUT", "POST"])
def return_movie(rental_id):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(
            "UPDATE rental SET return_date = NOW() WHERE rental_id = %s",
            (rental_id,)
        )
        if cursor.rowcount == 0:
            return jsonify({"error": "Rental not found"}), 404
        db.commit()
        return jsonify({"message": "Movie returned"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()

